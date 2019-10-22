import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
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
  cardFront: string | ''
  reverseSideCard: string | ''
}

class AddDriver extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    voltageAlarmValue: 0,
    voltageAutomaticPoweroffValue: 0,
    cardFront: '',
    reverseSideCard: ''
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


  handleUploadChange = (name: string, fileList : any) => {
    if (fileList.length > 0) {
      const imgUrl = fileList[0].response && fileList[0].response.data
      if(name === 'cardFront'){
        this.setState({
          cardFront: imgUrl
        })
      }
      if(name === 'reverseSideCard'){
        this.setState({
          reverseSideCard: imgUrl
        })
      }
    }else{
      if(name === 'cardFront'){
        this.setState({
          cardFront: ''
        })
      }
      if(name === 'reverseSideCard'){
        this.setState({
          reverseSideCard: ''
        })
      }
    }
  }

  componentWillReceiveProps(nextProps : any) {
    const {
      modalData: {
        cardFront,
        reverseSideCard
      }
    } = nextProps
    if(cardFront){
      this.setState({
        cardFront,
        reverseSideCard
      })
    }
  }

  handleSubmitModal = (fields : any) => {
    const {onOk, dispatch, modalData: {
        id
      }} = this.props;
    this.setState({confirmLoading: true});
      const {cardFront, reverseSideCard} = this.state
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
        ? 'carInfo/updateDriver'
        : 'carInfo/addDriver',
      payload: {
        id,
        ...fields,
        cardFront,
        reverseSideCard
      },
      callback
    });
  };

  modalFromColumns() {
    const {cardFront, reverseSideCard} = this.state
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
        requiredMessage: '请上传身份证正面',
        handleChange: this.handleUploadChange,
        pictures: cardFront
      }, {
        title: '身份证反面',
        dataIndex: 'reverseSideCard',
        componentType: 'Upload',
        requiredMessage: '请上传身份证反面',
        handleChange: this.handleUploadChange,
        pictures: reverseSideCard
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
