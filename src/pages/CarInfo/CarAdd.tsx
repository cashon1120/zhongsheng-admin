import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import moment from 'moment';
import {message} from 'antd';
import { CAR_BRAND } from '../../../public/config'

interface IProps {
  modalVisible : boolean;
  voltageData : any[],
  typeData: any[]
  dispatch : Dispatch;
  modalData : {
    [key : string]: any;
  };
  onCancel : () => void;
  onOk : (fields : object | undefined) => void;
}

interface IState {
  pictureList: any []
  confirmLoading : boolean;
  voltageAlarmValue: number | undefined,
  voltageAutomaticPoweroffValue: number | undefined,
  typeData: any[]
  voltageId: number | string
  voltageName: string
}

class AddCar extends Component < IProps,
IState > {
  state = {
    pictureList: [],
    confirmLoading: false,
    voltageAlarmValue: undefined,
    voltageAutomaticPoweroffValue: undefined,
    typeData: [],
    voltageId: '',
    voltageName: ''
  };

  formModalRef: any = ''
  componentDidMount() {
    const {voltageData, typeData, dispatch} = this.props
    if (voltageData.length <= 0) {
      dispatch({
        type: 'global/fetchVoltage',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
    }

    if (typeData.length <= 0) {
      const callback = (res: any) => {
        if(res.code === 1){
          this.setState({
            typeData: res.data.list
          })
        }
      }
      dispatch({
        type: 'global/fetchType',
        payload: {
          pageNum: 1,
          pageSize: 100
        },
        callback
      });
    }
  }

  onRefChild = (ref: any) => {
    this.formModalRef = ref
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

  setTypeValue = (value: any) => {
    const {typeData} = this.props
    let filterTypeData:any[] = []
    typeData.forEach((item: any) => {
      if(item.vehicleBrands === value){
        filterTypeData.push(item)
      }
    })
    this.setState({
      typeData: filterTypeData
    },() => {
      this.formModalRef.clearFormValue('model', undefined)
    })
  }


  setVoltageValue = (value: any) => {
    const {voltageData, typeData} = this.props
    let voltageId = ''
    typeData.forEach((item: any) => {
      if(item.vehicleModel === value){
        voltageId = item.batteryId
      }
    })
    voltageData.forEach((item: any) => {
      if(item.id === voltageId){
        this.setState({
          voltageId,
          voltageName: item.model,
          voltageAlarmValue: item.lowVoltageAlarmValue,
          voltageAutomaticPoweroffValue: item.automaticPoweroffValue
        })
      }
    })
  }



 // 上传图片回调, 设置对应图片数据列表
 handlePicChange = (name: string, fileList: any) => {
  this.setState({pictureList: fileList})
}

  modalFromColumns() {
    // const {pictureList} = this.state
    const {
      modalData: {
        plate,
        brands,
        model,
        color,
        frameNumber,
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
      voltageAutomaticPoweroffValue, typeData, voltageName} = this.state
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
        componentType: 'Select',
        initialValue: brands,
        requiredMessage: '请选择车辆品牌',
        required: true,
        placeholder: '请选择车辆品牌',
        dataSource: CAR_BRAND,
        handleChange: this.setTypeValue
      }, {
        title: '车辆型号',
        dataIndex: 'model',
        componentType: 'Select',
        selectName: 'vehicleModel',
        value: 'vehicleModel',
        initialValue: model,
        requiredMessage: '请输入车辆型号',
        required: true,
        placeholder: '请输入车辆型号',
        dataSource: typeData,
        handleChange: this.setVoltageValue
      },{
        title: '出厂日期',
        dataIndex: 'factoryTime',
        componentType: 'DatePicker',
        initialValue: factoryTime
          ? moment(factoryTime)
          : '',
        requiredMessage: '请选择生产日期',
        placeholder: '请选择车生产日期',
        required: true,
      }, {
        title: '电瓶型号',
        dataIndex: 'batteryModel',
        componentType: 'Input',
        disabled: true,
        initialValue: voltageName,
        requiredMessage: '请输入电瓶型号',
        required: true,
        placeholder: '请选择电瓶型号',
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
        requiredMessage: '请输入正确的车架号',
        required: true,
        placeholder: '请输入车架号',
        maxLength: 17
      },  {
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
        requiredMessage: '请输入正确的车载设备ID(8位)',
        required: true,
        placeholder: '请输入车载设备ID',
        maxLength: 8
      },{
        title: '备注',
        dataIndex: 'remark',
        componentType: 'Input',
        initialValue: remark,
        placeholder: '请输入备注'
      }
      // ,{
      //   title: '车辆图片',
      //   dataIndex: 'imgList',
      //   componentType: 'Upload',
      //   initialValue: vehicleEquipmentId,
      //   handleChange: this.handlePicChange,
      //   pictures: pictureList,
      //   requiredMessage: '请上传车辆图片',
      //   required: true,
      //   placeholder: '请上传车辆图片'
      // }
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
          ? '修改车辆'
          : '添加车辆'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          width={1000}
          onRefChild={this.onRefChild}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({global} : ConnectState) => ({voltageData: global.voltageData, typeData: global.typeData}))(AddCar);
