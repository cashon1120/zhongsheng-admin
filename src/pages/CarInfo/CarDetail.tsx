import React, {Component} from 'react';
import {
  Card,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
  Tabs
} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {ConnectProps, ConnectState} from '@/models/connect';
import StandardTable from '@/components/StandardTable';
import carImg from '../../assets/car.jpg'

const {confirm} = Modal;
const {TabPane} = Tabs;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  modalData : any;
  searchData : {
    [key : string]: any;
  };
  pageInfo : {
    pageSize: number;
    pageNum: number;
  };
}

class VoltageList extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    modalData: {},
    searchData: {},
    pageInfo: {
      pageSize: 10,
      pageNum: 1
    }
  };


  columns = [
    {
      title: '时间',
      dataIndex: 'brands',
      key: 'brands',
    },
    {
      title: '电压值',
      dataIndex: 'plate',
      key: 'plate',
    },{
      title: '电压状态',
      dataIndex: 'frameNumber',
      key: 'frameNumber',
    },{
      title: '操作',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },{
      title: '方式',
      dataIndex: 'ownerContact',
      key: 'ownerContact',
    },{
      title: '结果',
      dataIndex: 'vehicleEquipmentId',
      key: 'vehicleEquipmentId',
    },{
      title: '备注',
      dataIndex: 'initialMileage',
      key: 'initialMileage',
    }
  ];

  componentDidMount() {
    this.initData();
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;
    const {pageInfo, searchData} = this.state;
    const searchParams = {};
    // 拼接查询字段
    for (let key in searchData) {
      if (searchData[key]) {
        searchParams[key] = searchData[key];
      }
    }
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
        type: 'carInfo/fetchCar',
        payload: {
          ...searchParams,
          ...pageInfo,
          ...params
        }
      });
    }
  }

  // 提交模态框
  handleSubmitModal = () => {
    this.handleTriggerModal();
    this.initData()
  };

  // 显示/隐藏模态框
  handleTriggerModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible
    });
  };

  // 添加新数据
  handleAddNew = () => {
    this.setState({modalData: {}});
    this.handleTriggerModal();
  };

  // 编辑数据
  handleEdit = (record : any) => {
    this.setState({
      modalData: {
        ...record
      }
    });
    this.handleTriggerModal();
  };

  // 删除数据
  handleDel = (id : string) => {
    const {dispatch} = this.props;
    const callback = (res : any) => {
      if (res.code === 1) {
        message.success('操作成功');
        this.initData()
      } else {
        message.error(res.msg)
      }
    };
    confirm({
      title: '系统提示',
      content: '确认要删除该记录吗？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'carInfo/delVoltage', payload: {
              id
            }, callback});
        }
      }
    });
  };

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '电频型号',
        dataIndex: 'model',
        componentType: 'Input'
      }, {
        title: '车辆型号',
        dataIndex: 'type',
        componentType: 'Input'
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state;
    this.setState({
      searchData: {
        ...searchData,
        ...values
      }
    }, () => {
      this.initData();
    },);
  };

  // 重置搜索
  handleFormReset = () => {
    this.setState({
      searchData: {}
    }, () => {
      this.initData();
    },);
  };

  render() {
    const {data, loading} = this.props;
    return (
      <PageHeaderWrapper>
        <Card title="基本信息">
          <Row>
            <Col span={6}>
              <img src={carImg} className="car-detail"/>
            </Col>
            <Col span={18}>
              <Descriptions>
                <Descriptions.Item label="车牌号">川A 3434K2</Descriptions.Item>
                <Descriptions.Item label="车辆状态">行驶中(张三)</Descriptions.Item>
                <Descriptions.Item label="电压值">12</Descriptions.Item>
                <Descriptions.Item label="购买日期">2019-09-10</Descriptions.Item>
                <Descriptions.Item label="车辆位置">
                  天府软件园
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
        <Card style={{
          marginTop: 25
        }}>
          <Tabs type="card">
            <TabPane tab="车辆电压控制记录" key="1">
            <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params: object) => this.initData(params)}
          />
            </TabPane>
            <TabPane tab="车辆详细参数" key="2">
              <Descriptions>
                <Descriptions.Item label="车辆品牌">川A 3434K2</Descriptions.Item>
                <Descriptions.Item label="车辆型号">行驶中(张三)</Descriptions.Item>
                <Descriptions.Item label="生产厂家">12</Descriptions.Item>
                <Descriptions.Item label="生产日期">2019-09-10</Descriptions.Item>
                <Descriptions.Item label="电压报警值">天府软件园</Descriptions.Item>
                <Descriptions.Item label="电压自动断电值">天府软件园</Descriptions.Item>
                <Descriptions.Item label="车架号">天府软件园</Descriptions.Item>
                <Descriptions.Item label="购买时间">天府软件园</Descriptions.Item>
                <Descriptions.Item label="初始里程">天府软件园</Descriptions.Item>
                <Descriptions.Item label="车主联系方式">天府软件园</Descriptions.Item>
                <Descriptions.Item label="车主姓名">天府软件园</Descriptions.Item>
                <Descriptions.Item label="车载设备ID">天府软件园</Descriptions.Item>
                <Descriptions.Item label="备注">天府软件园</Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({carInfo, loading} : ConnectState) => ({ data: carInfo.carData, loading: loading.models.carInfo}))(VoltageList);
