import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';

interface IProps {
  modalVisible : boolean;
  roleData : any;
  partmentData : any;
  nationalityData: any;
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

class AddServiceShop extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0
  };

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
    dispatch({
      type: id
        ? 'system/updateStore'
        : 'system/addStore',
      payload: {
        id,
        ...fields,
        lng: '',
        lat: ''
      },
      callback
    });
  };

  modalFromColumns() {
    const {
      modalData: {
        name,
        address,
        concatPhone
      }
    } = this.props;
    return [
      {
        title: '店铺名称',
        dataIndex: 'name',
        componentType: 'Input',
        initialValue: name,
        requiredMessage: '请输入用户姓名',
        required: true,
        placeholder: '请输入用户姓名'
      }, {
        title: '店铺地址',
        dataIndex: 'address',
        componentType: 'Input',
        initialValue: address,
        requiredMessage: '请输入店铺地址',
        required: true,
        placeholder: '请输入店铺地址'
      }, {
        title: '联系方式',
        dataIndex: 'concatPhone',
        componentType: 'Input',
        initialValue: concatPhone,
        requiredMessage: '请输入联系电话',
        required: true,
        placeholder: '请输入联系电话'
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
          ? '修改店铺'
          : '添加店铺'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({roleData: global.roleData,nationalityData: global.nationalityData, partmentData: global.partmentData}))(AddServiceShop);
