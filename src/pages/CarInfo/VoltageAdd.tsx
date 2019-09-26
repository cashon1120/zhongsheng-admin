import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import moment from 'moment';
import { message } from 'antd';

interface IProps {
  modalVisible : boolean;
  dispatch : Dispatch;
  modalData : {
    [key : string]: any;
  };
  onCancel : () => void;
  onOk : (fields : object | undefined) => void;
}

interface IState {
  confirmLoading : boolean;
}

class AddAccount extends Component < IProps,
IState > {
  state = {
    confirmLoading: false
  };

  handleSubmitModal = (fields : any) => {
    const {onOk, dispatch, modalData:{id}} = this.props;
    this.setState({confirmLoading: true});

    // 定义异步回调
    const callback = (res: any) => {
      this.setState({confirmLoading: false});
      if(res.code !== 1){
        message.error(res.msg)
        return
      }
      dispatch({
        type: 'global/fetchVoltage',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
      onOk(fields);
    };
    const productionDate = moment(fields.productionDate).format('YYYY-MM-DD HH:mm:ss')
    dispatch({
      type: id ? 'carInfo/updateVoltage' : 'carInfo/addVoltage',
      payload: {
        id,
        ...fields,
        productionDate
      },
      callback
    });
  };

  modalFromColumns() {
    const {
      modalData: {
        model,
        factory,
        productionDate,
        lowVoltageAlarmValue,
        automaticPoweroffValue,
        remark
      }
    } = this.props;
    return [
      {
        title: '电瓶型号',
        dataIndex: 'model',
        componentType: 'Input',
        initialValue: model,
        requiredMessage: '请输入电瓶型号',
        required: true,
        placeholder: '请输入电瓶型号'
      }, {
        title: '生产日期',
        dataIndex: 'productionDate',
        componentType: 'DatePicker',
        initialValue: productionDate ? moment(productionDate) : '',
        requiredMessage: '请选择生产日期',
        required: true,
        placeholder: '请选择生产日期'
      }, {
        title: '电压偏低报警值',
        dataIndex: 'lowVoltageAlarmValue',
        componentType: 'InputNumber',
        initialValue: lowVoltageAlarmValue,
        requiredMessage: '请输入电压偏低报警值',
        required: true,
        placeholder: '请输入电压偏低报警值'
      }, {
        title: '电压自动断电值',
        dataIndex: 'automaticPoweroffValue',
        componentType: 'InputNumber',
        initialValue: automaticPoweroffValue,
        requiredMessage: '请输入电压自动断电值',
        required: true,
        placeholder: '请输入电压自动断电值'
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
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({} : ConnectState) => ({}))(AddAccount);
