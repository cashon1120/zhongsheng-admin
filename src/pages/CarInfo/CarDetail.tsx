import React, {Component, Fragment} from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tabs,
  Spin
} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {ConnectProps, ConnectState} from '@/models/connect';
import StandardTable from '@/components/StandardTable';
import carImg from '../../assets/car.jpg'
const {TabPane} = Tabs;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
}

interface IState {
  carInfo: any,
  id: number
}

class VoltageList extends Component < IProps,
IState > {
  constructor(props : any) {
    super(props);
    this.state = {
      carInfo: {},
      id: props.match.params.id
    };
  }


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
  initData() {
    const {dispatch} = this.props;
    const {id} = this.state
    const callback = (res: any) => {
      if(res.code === 1) {
        this.setState({
          carInfo: res.data
        })
      }
    }
    if (dispatch) {
      dispatch({
        type: 'carInfo/detailCar',
        payload: {
          id
        },
        callback
      });
    }
  }

  render() {
    const {data, loading} = this.props;
    const {carInfo } = this.state
    return (
      <PageHeaderWrapper>
        {carInfo.plate ? <Fragment>  <Card title="基本信息">
          <Row>
            <Col span={6}>
              <img src={carImg} className="car-detail"/>
            </Col>
            <Col span={18}>
              <Descriptions>
                <Descriptions.Item label="车牌号">{carInfo.plate}</Descriptions.Item>
                <Descriptions.Item label="车辆状态">{carInfo.plate}</Descriptions.Item>
                <Descriptions.Item label="电压值">{carInfo.plate}</Descriptions.Item>
                <Descriptions.Item label="购买日期">{carInfo.purchaseTime.split(' ')[0]}</Descriptions.Item>
                <Descriptions.Item label="车辆位置">
                {carInfo.plate}
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
            onChangeCombine={(params: object) => this.initData()}
          />
            </TabPane>
            <TabPane tab="车辆详细参数" key="2">
              <Descriptions>
                <Descriptions.Item label="车辆品牌">{carInfo.brands}</Descriptions.Item>
                <Descriptions.Item label="车辆型号">{carInfo.model}</Descriptions.Item>
                <Descriptions.Item label="生产日期">{carInfo.factoryTime}</Descriptions.Item>
                <Descriptions.Item label="电压报警值">{carInfo.voltageAlarmValue}</Descriptions.Item>
                <Descriptions.Item label="电压自动断电值">{carInfo.voltageAutomaticPoweroffValue}</Descriptions.Item>
                <Descriptions.Item label="车架号">{carInfo.frameNumber}</Descriptions.Item>
                <Descriptions.Item label="购买时间">{carInfo.purchaseTime}</Descriptions.Item>
                <Descriptions.Item label="初始里程">{carInfo.initialMileage}</Descriptions.Item>
                <Descriptions.Item label="车主联系方式">{carInfo.ownerContact}</Descriptions.Item>
                <Descriptions.Item label="车主姓名">{carInfo.ownerName}</Descriptions.Item>
                <Descriptions.Item label="车载设备ID">{carInfo.vehicleEquipmentId}</Descriptions.Item>
                <Descriptions.Item label="备注">{carInfo.remark}</Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        </Card></Fragment> : null}
      
        <Spin size="large" spinning={loading} className="spin"/>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({carInfo, loading} : ConnectState) => ({ data: carInfo.carData, loading: loading.models.carInfo}))(VoltageList);
