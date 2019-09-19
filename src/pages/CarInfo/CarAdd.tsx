import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import moment from 'moment';
import {message} from 'antd';

interface IProps {
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
  voltageAutomaticPoweroffValue: number,
}

class AddCar extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0,
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
      onOk(fields);
    };
    const factoryTime = moment(fields.factoryTime).format('YYYY-MM-DD HH:mm:ss')
    const purchaseTime = moment(fields.purchaseTime).format('YYYY-MM-DD HH:mm:ss')
    dispatch({
      type: id
        ? 'carInfo/updateCar'
        : 'carInfo/addCar',
      payload: {
        id,
        ...fields,
        factoryTime,
        purchaseTime
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
        plate,
        brands,
        model,
        color,
        frameNumber,
        batteryModel,
        factoryTime,
        purchaseTime,
        initialMileage,
        ownerName,
        ownerContact,
        vehicleEquipmentId,
        remark
      }
    } = this.props;
    const { voltageAlarmValue,
      voltageAutomaticPoweroffValue,} = this.state
    return [
      {
        title: '车牌号',
        dataIndex: 'plate',
        componentType: 'Input',
        initialValue: plate,
        requiredMessage: '请输入车牌号',
        required: true,
        placeholder: '请输入车牌号'
      }, {
        title: '车辆品牌',
        dataIndex: 'brands',
        componentType: 'Input',
        initialValue: brands,
        requiredMessage: '请输入车辆品牌',
        required: true,
        placeholder: '请输入车辆品牌'
      }, {
        title: '车辆型号',
        dataIndex: 'model',
        componentType: 'Input',
        initialValue: model,
        requiredMessage: '请输入车辆型号',
        required: true,
        placeholder: '请输入车辆型号'
      }, {
        title: '车辆颜色',
        dataIndex: 'color',
        componentType: 'Input',
        initialValue: color,
        requiredMessage: '请输入车辆颜色',
        required: true,
        placeholder: '请输入车辆颜色'
      }, {
        title: '车架号',
        dataIndex: 'frameNumber',
        componentType: 'Input',
        initialValue: frameNumber,
        requiredMessage: '请输入车架号',
        required: true,
        placeholder: '请输入车架号'
      }, {
        title: '电瓶型号',
        dataIndex: 'batteryModel',
        componentType: 'Select',
        initialValue: batteryModel,
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
        title: '出厂时间',
        dataIndex: 'factoryTime',
        componentType: 'DatePicker',
        initialValue: factoryTime
          ? moment(factoryTime)
          : '',
        requiredMessage: '请选择出厂时间',
        placeholder: '请选择车出厂时间',
        required: true,
      }, {
        title: '购买时间',
        dataIndex: 'purchaseTime',
        componentType: 'DatePicker',
        initialValue: purchaseTime
          ? moment(purchaseTime)
          : '',
        requiredMessage: '请选择出厂时间',
        placeholder: '请选择车出厂时间',
        required: true,
      }, {
        title: '初始里程',
        dataIndex: 'initialMileage',
        componentType: 'InputNumber',
        initialValue: initialMileage,
        requiredMessage: '请输入初始里程',
        required: true,
        placeholder: '请输入初始里程'
      }, {
        title: '车主联系方式',
        dataIndex: 'ownerContact',
        componentType: 'Input',
        initialValue: ownerContact,
        requiredMessage: '请输入车主联系方式',
        required: true,
        placeholder: '请输入车主联系方式'
      }, {
        title: '车主姓名',
        dataIndex: 'ownerName',
        componentType: 'Input',
        initialValue: ownerName,
        requiredMessage: '请输入车主姓名',
        required: true,
        placeholder: '请输入车主姓名'
      }, {
        title: '车载设备ID',
        dataIndex: 'vehicleEquipmentId',
        componentType: 'Input',
        initialValue: vehicleEquipmentId,
        requiredMessage: '请输入车载设备ID',
        required: true,
        placeholder: '请输入车载设备ID'
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
          ? '修改'
          : '添加'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          width={1000}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({voltageData: global.voltageData}))(AddCar);
