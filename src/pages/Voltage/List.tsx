import React, {Component, Fragment} from 'react';
import {
  Card,
  Tabs,
  Modal,
  Col,
  Row,
  Select,
  message
} from 'antd';
import {connect} from 'dva';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import {ConnectProps, ConnectState} from '@/models/connect';
import Count_Vehicle from './Count_Vehicle'
import Count_Voltage from './Count_Voltage'
import Count_Breakdown from './Count_Breakdown'
import Count_Dispatch from './Count_Dispatch'

const {TabPane} = Tabs;
const {Option} = Select;

const formartVoltageState = (state: number) => {
  let str = ''
      switch (state) {
        case 3:
          str = '设备失联'
          break;
        case 5:
          str = '自动断电'
          break;

        default:
          break;
      }
      return <span style={{
        color: '#f00'
      }}>{str}</span>
}

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
  userData: any
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  activeKey : string | null
  editData: {
    [key: string]: any
  };
  processings: any[]
  vehicleInfo: any,
  pageInfo : {
    pageSize: number;
    pageNum: number;
  };
}

class UserInfoList extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    editData: {
      id: 0,
      vehicleName: '',
      exceptionCode: 0,
      exceptionTime: '',
      concatName: '',
      concatPhone: '',
      lat: '',
      lng: '',
    },
    vehicleInfo: {
      vehicleMonthCount: [],
      vehicleVoltageCount: [],
      batteryMalfunction: [],
      abnormalDispatchRate: []
    },
    processings: [],
    activeKey: '1',
    pageInfo: {
      pageSize: 10,
      pageNum: 1
    }
  };

  columns = [
    {
      title: '车辆信息',
      key: 'plate',
      render: (record : any) => {
        return <Fragment>
          <div>{record.plate}</div>{record.vehicleName}</Fragment>
      }
    }, {
      title: '照片',
      dataIndex: 'sex',
      key: 'area'
    }, {
      title: '设备状态',
      dataIndex: 'exceptionCode',
      key: 'exceptionCode',
      render: (exceptionCode: number) => formartVoltageState(exceptionCode)
    }, {
      title: '失联时间',
      dataIndex: 'exceptionTime',
      key: 'exceptionTime'
    }, {
      title: '处理状态',
      dataIndex: 'state',
      key: 'state',
      render: (state : number) => {
        let str = ''
        switch (state) {
          case 1:
            str = '未处理'
            break;
          case 2:
            str = '已指派'
            break;
          case 3:
            str = '处理中'
            break;
          case 4:
            str = '已处理'
            break;

          default:
            break;
        }
        return str
      }
    }, {
      title: '操作',
      width: 100,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleSetState(record)}>派单</a>
        </div>
      )
    }
  ];

  componentDidMount() {
    const {userData, dispatch} = this.props
    if(userData.length === 0 && dispatch) {
      dispatch({
        type: 'global/fetchUser',
        payload: {
          pageNum: 1,
          pageSize: 100
        }
      });
    }
    this.initData();
    this.getVehicleInfo()
  }

  handleSetState = (record : any) => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
      editData: record
    });
  }

  getVehicleInfo(){
    const {dispatch} = this.props;
    const callback = (res: any) => {
      if(res.code === 1){
        this.setState({
          vehicleInfo: res.data
        })
      }
    }
    if (dispatch) {
      dispatch({
        type: 'voltage/fetchVehicleInfo',
        callback
      });
    }
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;
    const {pageInfo, activeKey} = this.state;
    // 设置页码
    if (params) {
      this.setState({
        pageInfo: {
          pageNum: params.pageNum,
          pageSize: params.pageSize
        }
      });
    }

    if (dispatch) {
      dispatch({
        type: 'voltage/fetchOffPower',
        payload: {
          ...pageInfo,
          ...params,
          state: activeKey
        }
      });
    }
  }

  onTabsChange = (key : string) => {
    let state : string | null = ''
    switch (key) {
      case '1':
        state = null
        break;
      case '2':
        state = '1'
        break;
      case '3':
        state = '3'
        break;
      default:
        break;
    }
    this.setState({
      activeKey: state
    }, () => {
      this.initData()
    });
  };

  handleOk = (e : any) => {
    const{dispatch} = this.props
    const {editData, processings} = this.state
    
    if(processings.length === 0) {
      message.error('请选择救援人员')
      return
    }
    const callback = (res: any) => {
      if(res.code === 1) {
        this.setState({modalVisible: false});
        message.success('指派成功')
      }else{
        message.error(res.msg)
      }
    }
    if (dispatch) {
      dispatch({
        type: 'voltage/assign',
        payload: {
          id: editData.id,
          processings
        },
        callback
      });
    }
    
  };

  handleCancel = (e : any) => {
    this.setState({modalVisible: false});
  };

  handleChange = (processings: any) => {
    let arr:any = []
    processings.forEach((item: any) => {
      arr.push({userId: item})
    })
    this.setState({
      processings: arr
    })
  }

  render() {
    const {data, loading, userData} = this.props;
    const {modalVisible, editData, vehicleInfo} = this.state
    return (
      <PageHeaderWrapper>
        <Row gutter={16} style={{
          marginBottom: 20
        }}>
          <Col span={6}>
            <Card>
              <Count_Vehicle data={vehicleInfo.vehicleMonthCount} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Count_Voltage data={vehicleInfo.vehicleVoltageCount} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
            <Count_Breakdown data={vehicleInfo.batteryMalfunction} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Count_Dispatch data={vehicleInfo.abnormalDispatchRate} />
            </Card>
          </Col>
        </Row>
        <Card title="被动断电汽车">
          <Tabs defaultActiveKey="1" onChange={e => this.onTabsChange(e)}>
            <TabPane tab="全部(365)" key="1"></TabPane>
            <TabPane tab="未处理" key="2"></TabPane>
            <TabPane tab="处理中" key="3"></TabPane>
          </Tabs>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Card>
        <Modal
          title="电压监控"
          visible={modalVisible}
          confirmLoading={loading}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <h3>{editData.vehicleName}</h3>
         {formartVoltageState(editData.exceptionCode)}
          <ul className="vlotageDetail">
            <li>
              <span className="lable">最后联线时间:</span>
              {editData.exceptionTime}
            </li>
            <li>
              <span className="lable">地理位置:</span>
              {editData.lat},{editData.lng}
            </li>
            <li>
              <span className="lable">车主:</span>
              {editData.concatName}
            </li>
            <li>
              <span className="lable">联系方式:</span>
              {editData.concatPhone}
            </li>
            <li>
              <span className="lable">救援人员:</span>
              <div className="selectWrapper">
                <Select
                  mode="multiple"
                  style={{
                  width: '100%'
                }}
                  placeholder="请选择(可多选)"
                  onChange={this.handleChange}>
                    {userData.map((item: any) => 
                      <Option key={item.id} value={item.id}>{item.userName}</Option>
                    )}
                </Select>
              </div>
            </li>
          </ul>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({voltage, loading, global} : ConnectState) => ({data: voltage.data, loading: loading.models.voltage, userData: global.userData}))(UserInfoList);
