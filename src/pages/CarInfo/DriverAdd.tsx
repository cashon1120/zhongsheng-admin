import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import moment from 'moment';
import {message} from 'antd';
import {ANNUAL_INCOME, SEX_TYPE} from '../../../public/config'

interface IProps {
  modalVisible : boolean;
  nationalityData : any[],
  professionData: any[]
  dispatch : Dispatch;
  modalData : {
    [key : string]: any;
  };
  onCancel : () => void;
  onOk : (fields : object | undefined) => void;
}

interface IState {
  confirmLoading : boolean;
  voltageAlarmValue : number,
  voltageAutomaticPoweroffValue : number,
  cardFrontUrl : string
  reverseSideCardUrl : string
}

class AddDriver extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0,
    cardFrontUrl: '',
    reverseSideCardUrl: ''
  };

  componentDidMount() {
    const {professionData, nationalityData, dispatch} = this.props
    if (professionData.length <= 0) {
      dispatch({
        type: 'global/fetchProfession',
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
    const factoryTime = moment(fields.factoryTime).format('YYYY-MM-DD HH:mm:ss')
    const purchaseTime = moment(fields.purchaseTime).format('YYYY-MM-DD HH:mm:ss')
    dispatch({
      type: id
        ? 'carInfo/updateDriver'
        : 'carInfo/addDriver',
      payload: {
        id,
        ...fields,
        factoryTime,
        purchaseTime
      },
      callback
    });
  };

  handleUploadChange = (e : any) => {
    console.log(e)
  }

  modalFromColumns() {
    const {cardFrontUrl, reverseSideCardUrl} = this.state
    const {
      professionData,
      nationalityData,
      modalData: {
        realName,
        sex,
        concatPhone,
        nationality,
        identificationNumber,
        industry,
        annualIncome,
        residentialAddress,
        cardFront,
        reverseSideCard,
        remarks
      }
    } = this.props;
    return [
      {
        title: '用户姓名',
        dataIndex: 'realName',
        componentType: 'Input',
        initialValue: realName,
        requiredMessage: '请输入用户姓名',
        required: true,
        placeholder: '请输入车牌号'
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
        dataIndex: 'concatPhone',
        componentType: 'Input',
        initialValue: concatPhone,
        requiredMessage: '请输入联系电话',
        required: true,
        placeholder: '请输入联系电话'
      }, {
        title: '名族',
        dataIndex: 'nationality',
        componentType: 'Select',
        initialValue: nationality,
        requiredMessage: '请选择名族',
        required: true,
        placeholder: '请选择名族',
        dataSource: nationalityData
      }, {
        title: '身份证号',
        dataIndex: 'identificationNumber',
        componentType: 'Input',
        initialValue: identificationNumber,
        requiredMessage: '请输入身份证号',
        required: true,
        placeholder: '请输入身份证号'
      }, {
        title: '所属行业',
        dataIndex: 'industry',
        componentType: 'Select',
        initialValue: industry,
        requiredMessage: '请选择所属行业',
        required: true,
        placeholder: '请选择所属行业',
        dataSource: professionData
      }, {
        title: '年收入',
        dataIndex: 'annualIncome',
        componentType: 'Select',
        initialValue: annualIncome,
        requiredMessage: '请选择年收入',
        required: true,
        placeholder: '请选择年收入',
        dataSource: ANNUAL_INCOME
      }, {
        title: '居住地址',
        dataIndex: 'residentialAddress',
        componentType: 'Input',
        initialValue: residentialAddress,
        requiredMessage: '请输入居住地址',
        required: true,
        placeholder: '请输入居住地址'
      }, {
        title: '身份证正面',
        dataIndex: 'cardFront',
        componentType: 'Upload',
        initialValue: cardFront,
        requiredMessage: '请上传身份证正面',
        // required: true,
        handleChange: this.handleUploadChange,
        imgUrl: cardFrontUrl
      }, {
        title: '身份证反面',
        dataIndex: 'reverseSideCard',
        componentType: 'Upload',
        initialValue: reverseSideCard,
        requiredMessage: '请上传身份证反面',
        // required: true,
        imgUrl: reverseSideCardUrl
      }, {
        title: '备注',
        dataIndex: 'remark',
        componentType: 'TextArea',
        initialValue: remarks,
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

export default connect(({global} : ConnectState) => ({professionData: global.professionData, nationalityData: global.nationalityData}))(AddDriver);
