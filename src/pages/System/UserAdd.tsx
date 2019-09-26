import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';
import {SEX_TYPE} from '../../../public/config'

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

class AddRole extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0
  };

  componentDidMount() {
    const {roleData, partmentData, nationalityData, dispatch} = this.props
    if (roleData.length <= 0) {
      dispatch({
        type: 'global/fetchRole',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
    }
    if (partmentData.length <= 0) {
      dispatch({
        type: 'global/fetchPartment',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
    }
    if (nationalityData.length <= 0) {
      dispatch({
        type: 'global/fetchNationality',
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
    dispatch({
      type: id
        ? 'system/updateUser'
        : 'system/addUser',
      payload: {
        id,
        ...fields
      },
      callback
    });
  };

  modalFromColumns() {
    const {
      nationalityData,
      roleData,
      partmentData,
      modalData: {
        userName,
        notiality,
        sex,
        phoneNo,
        roleId,
        departId
      }
    } = this.props;
    return [
      {
        title: '用户姓名',
        dataIndex: 'userName',
        componentType: 'Input',
        initialValue: userName,
        requiredMessage: '请输入用户姓名',
        required: true,
        placeholder: '请输入用户姓名'
      }, {
        title: '性别',
        dataIndex: 'sex',
        componentType: 'Select',
        initialValue: sex,
        requiredMessage: '请选择性别',
        required: true,
        placeholder: '请选择性别',
        dataSource: SEX_TYPE
      }, {
        title: '联系电话',
        dataIndex: 'phoneNo',
        componentType: 'Input',
        initialValue: phoneNo,
        requiredMessage: '请输入联系电话',
        required: true,
        placeholder: '请输入联系电话'
      }, {
        title: '名族',
        dataIndex: 'notiality',
        componentType: 'Select',
        initialValue: notiality,
        requiredMessage: '请选择性别',
        required: true,
        placeholder: '请选择性别',
        dataSource: nationalityData
      }, {
        title: '所在部门',
        dataIndex: 'departId',
        selectName: 'departName',
        componentType: 'Select',
        initialValue: departId,
        requiredMessage: '请选择部门',
        required: true,
        placeholder: '请选择部门',
        dataSource: partmentData
      }, {
        title: '角色',
        dataIndex: 'roleId',
        selectName: 'roleName',
        componentType: 'Select',
        initialValue: roleId,
        requiredMessage: '请选择角色',
        required: true,
        placeholder: '请选择角色',
        dataSource: roleData
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
          ? '修改用户'
          : '添加用户'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({roleData: global.roleData,nationalityData: global.nationalityData, partmentData: global.partmentData}))(AddRole);
