import React, {Component} from 'react';
import {Card, Row, Col, Descriptions, Spin} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {Dispatch} from 'redux';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {ConnectProps, ConnectState} from '@/models/connect';
import StandardTable from '@/components/StandardTable';
import carImg from '../../assets/car.jpg'
import {formatSex, getAge} from '../../utils/utils'

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
  nationalityData: any;
  dispatch : Dispatch;
  professionData: any;
}

interface IState {
  loading : boolean;
  id : number;
  driverInfo : any;
  pageInfo : {
    pageSize: number;
    pageNum: number;
  };
}

class DriverDetail extends Component < IProps,
IState > {
  constructor(props : any) {
    super(props)
    this.state = {
      loading: false,
      id: props.match.params.id,
      driverInfo: {},
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      }
    }
  }

  columns = [
    {
      title: '车牌',
      dataIndex: 'brands',
      key: 'brands'
    }, {
      title: '车型',
      dataIndex: 'plate',
      key: 'plate'
    }, {
      title: '购车时间',
      dataIndex: 'frameNumber',
      key: 'frameNumber'
    }, {
      title: '购买金额',
      dataIndex: 'ownerName',
      key: 'ownerName'
    }
  ];

  componentDidMount() {
    this.initData();
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

  // 加载数据
  initData() {
    const {dispatch} = this.props;
    const {id} = this.state
    const callback = (res : any) => {
      if (res.code === 1) {
        this.setState({driverInfo: res.data})
      }
    }
    if (dispatch) {
      dispatch({type: 'carInfo/detailDriver', payload: {
          id
        }, callback});
    }
  }

  formatNationality = (type : number) => {
    const {nationalityData} = this.props
    let str = ''
    nationalityData.forEach((item: any) => {
      if(item.value === type){
        str = item.name
      }
    })
    return str
  }


  render() {
    const {data, loading} = this.props;
    const {driverInfo} = this.state
    return (
      <PageHeaderWrapper>
        <Card title="基本信息">
          <Row>
            <Col span={6}>
              <img src={carImg} className="car-detail"/>
            </Col>
            <Col span={18}>
              <Descriptions>
                <Descriptions.Item label="用户姓名">{driverInfo.realName}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{driverInfo.concatPhone}</Descriptions.Item>
                <Descriptions.Item label="性别">{formatSex(driverInfo.sex)}</Descriptions.Item>
                <Descriptions.Item label="所属行业">{driverInfo.industry}</Descriptions.Item>
                <Descriptions.Item label="名族">{this.formatNationality(driverInfo.nationality)}</Descriptions.Item>
                <Descriptions.Item label="年龄">{getAge(driverInfo.identificationNumber)}</Descriptions.Item>
                <Descriptions.Item label="身份证号码">{driverInfo.identificationNumber}</Descriptions.Item>
                <Descriptions.Item label="居住地址">{driverInfo.residentialAddress}</Descriptions.Item>
                <Descriptions.Item label="备注">{driverInfo.remarks}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
        <Card title="名下车辆" style={{
          marginTop: 25
        }}>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData()}/>
        </Card>
        <Spin size="large" spinning={loading} className="spin"/>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({global, loading} : ConnectState) => ({professionData: global.professionData, nationalityData: global.nationalityData, loading: loading.models.carInfo}))(DriverDetail);

