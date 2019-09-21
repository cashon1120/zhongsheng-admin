import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';

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

class AddRole extends Component < IProps,
IState > {
  state = {
    confirmLoading: false
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
        ? 'system/updateRole'
        : 'system/addRole',
      payload: {
        id,
        ...fields
      },
      callback
    });
  };

  modalFromColumns() {
    const {
      modalData: {
        roleName,
        remark
      }
    } = this.props;
    return [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        componentType: 'Input',
        initialValue: roleName,
        requiredMessage: '请输入角色名称',
        required: true,
        placeholder: '请输入角色名称'
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
          ? '修改角色'
          : '添加角色'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({voltageData: global.voltageData}))(AddRole);
