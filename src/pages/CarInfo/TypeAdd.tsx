import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';
import { CAR_BRAND } from '../../../public/config'

interface IProps {
  form: any;
  modalVisible : boolean;
  voltageData : any,
  dispatch : Dispatch;
  modalData : {
    [key : string]: any;
  };
  onCancel : () => void;
  onOk : (fields : object | undefined) => void;
}

interface IState {
  confirmLoading : boolean;
  voltageAlarmValue: number,
  voltageAutomaticPoweroffValue: number
}

class AddCar extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0
  };

  componentDidMount() {
    const {voltageData, dispatch} = this.props
    if (voltageData.length <= 0) {
      dispatch({
        type: 'global/fetchVoltage',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
    }
  }

  handleSubmitModal = (fields : any) => {
    const {onOk, dispatch, modalData: {
        id
      }} = this.props;
    this.setState({confirmLoading: true});

    // 定义异步回调
    const callback = (res : any) => {
      this.setState({confirmLoading: false});
      if (res.code !== 1) {
        message.error(res.msg)
        return
      }
      dispatch({
        type: 'global/fetchType',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
      onOk(fields);
    };
    delete fields.batteryFactory
    delete fields.lowVoltageAlarmValue
    delete fields.automaticPoweroffValue
    dispatch({
      type: id
        ? 'carInfo/updateType'
        : 'carInfo/addType',
      payload: {
        id,
        ...fields
      },
      callback
    });
  };

  setVoltageValue = (value: any) => {
    const {voltageData} = this.props
    voltageData.forEach((item: any) => {
      if(item.id === value){
        this.setState({
          voltageAlarmValue: item.lowVoltageAlarmValue,
          voltageAutomaticPoweroffValue: item.automaticPoweroffValue
        })
      }
    })
  }

  modalFromColumns() {
    const {
      voltageData,
      modalData: {
        vehicleBrands,
        vehicleModel,
        batteryId,
        remark
      }
    } = this.props;
    const { voltageAlarmValue,
      voltageAutomaticPoweroffValue } = this.state
    return [
      {
        title: '车辆品牌',
        dataIndex: 'vehicleBrands',
        componentType: 'Select',
        initialValue: vehicleBrands,
        requiredMessage: '请选择车辆品牌',
        required: true,
        placeholder: '请选择车辆品牌',
        dataSource: CAR_BRAND
      }, {
        title: '车辆型号',
        dataIndex: 'vehicleModel',
        componentType: 'Input',
        initialValue: vehicleModel,
        requiredMessage: '请输入车辆型号',
        required: true,
        placeholder: '请输入车辆型号'
      }, {
        title: '电瓶型号',
        dataIndex: 'batteryId',
        componentType: 'Select',
        initialValue: batteryId,
        requiredMessage: '请输入电瓶型号',
        required: true,
        placeholder: '请选择电瓶型号',
        dataSource: voltageData,
        handleChange: this.setVoltageValue
      },
       {
        title: '电压报警值',
        dataIndex: 'lowVoltageAlarmValue',
        componentType: 'InputNumber',
        initialValue: voltageAlarmValue,
        requiredMessage: '请选择电瓶型号',
        required: true,
        placeholder: '请选择电瓶型号',
        disabled: true
      }, {
        title: '电压自动断电值',
        dataIndex: 'automaticPoweroffValue',
        componentType: 'InputNumber',
        initialValue: voltageAutomaticPoweroffValue,
        requiredMessage: '请选择电瓶型号',
        required: true,
        placeholder: '请选择电瓶型号',
        disabled: true
      }, {
        title: '备注',
        dataIndex: 'remark',
        componentType: 'TextArea',
        initialValue: remark,
        placeholder: '请输入备注'
      }
    ];
  }

  render() {
    const {confirmLoading} = this.state;
    const {modalVisible, onCancel, modalData: {
        id
      }} = this.props;
    return (
      <Fragment>
        <ModalFrom
          title={id
          ? '修改车型'
          : '添加车型'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({voltageData: global.voltageData}))(AddCar);
