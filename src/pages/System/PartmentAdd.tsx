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

class AddPartment extends Component < IProps,
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
        ? 'system/updatePartment'
        : 'system/addPartment',
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
        departName,
        remark
      }
    } = this.props;
    return [
      {
        title: '部门名称',
        dataIndex: 'departName',
        componentType: 'Input',
        initialValue: departName,
        requiredMessage: '请输入部门名称',
        required: true,
        placeholder: '请输入部门名称'
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
          ? '修改部门'
          : '添加部门'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({voltageData: global.voltageData}))(AddPartment);
