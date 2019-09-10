import React, { Component } from 'react';
import { Card, Tabs, message, Modal, Col, Row, Statistic } from 'antd';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { ConnectProps, ConnectState } from '@/models/connect';
import moment from 'moment';
const { confirm } = Modal;
const { TabPane } = Tabs;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
}

interface IState {
  loading: boolean;
  modalVisible: boolean;
  selectedRowKeys: any[];
  searchData: {
    [key: string]: any;
  };
  pageInfo: {
    pageSize: number;
    pageNum: number;
  };
}

class UserInfoList extends Component<IProps, IState> {
  state = {
    loading: false,
    modalVisible: false,
    selectedRowKeys: [],
    searchData: {
      name: '',
      status: '',
      startTime: '',
      endTime: '',
    },
    pageInfo: {
      pageSize: 10,
      pageNum: 1,
    },
  };

  columns = [
    {
      title: '车辆信息',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '照片',
      dataIndex: 'sex',
      key: 'area',
    },
    {
      title: '设备状态',
      dataIndex: 'birth',
      key: 'birth',
    },
    {
      title: '失联时间',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      render: (record: any) => (
        <div className="table-operate">
          <Link to={`/userInfo/detail/${record.id}`}>详情</Link>
          <a onClick={() => this.hadleCheckOut(record.id)}>初审通过</a>
          <a>取消审核</a>
        </div>
      ),
    },
  ];

  componentDidMount() {
    this.initData();
  }

  handleTriggerModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  handleSelectRows = (selectedRowKeys: any[]) => {
    this.setState({ selectedRowKeys });
  };

  // 加载数据
  initData(params?: any) {
    const { dispatch } = this.props;
    const { pageInfo, searchData } = this.state;
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
          pageSize: params.pageSize,
        },
      });
    }

    if (dispatch) {
      dispatch({
        type: 'userInfo/fetch',
        payload: {
          ...searchParams,
          ...pageInfo,
          ...params,
        },
      });
    }
  }

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        componentType: 'Input',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        componentType: 'Select',
        dataSource: [
          {
            value: 1,
            name: '是',
          },
          {
            value: 0,
            name: '否',
          },
        ],
      },
      {
        title: '日期',
        dataIndex: 'times',
        componentType: 'RangePicker',
        col: 8,
      },
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values: any) => {
    const { searchData } = this.state;
    let startTime = '';
    let endTime = '';
    if (values.times) {
      startTime = moment(values.times[0]).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(values.times[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    this.setState(
      {
        searchData: {
          ...searchData,
          name: values.name,
          status: values.status,
          startTime,
          endTime,
        },
      },
      () => {
        this.initData();
      },
    );
  };

  // 重置搜索
  handleFormReset = () => {
    this.setState(
      {
        searchData: {},
      },
      () => {
        this.initData();
      },
    );
  };

  // 导出详情
  exportFiel = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error('请勾选要导出的数据');
      return;
    }
    if (dispatch) {
      dispatch({ type: 'userInfo/exportFile', payload: {} });
    }
  };

  hadleCheckOut = (id: string) => {
    const { dispatch } = this.props;
    const callback = (response: any) => {
      if (response.success) {
        message.success('操作成功');
      }
    };
    confirm({
      title: '审核信息',
      content: '审核通过后，考生即可扫描二维码考试，是否通过审核？',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'userInfo/checkOut',
            payload: {
              id,
            },
            callback,
          });
        }
      },
    });
  };

  render() {
    const { data, loading } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <PageHeaderWrapper>
        <Row
          gutter={16}
          style={{
            marginBottom: 20,
          }}
        >
          <Col span={6}>
            <Card>
              <Statistic title="电压正常数量" value={112893} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="低电压报警数量" value={112893} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="被动断电数量" value={112893} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="主动断电数量" value={112893} />
            </Card>
          </Col>
        </Row>
        <Card title="被动断电汽车">
          <Tabs defaultActiveKey="1">
            <TabPane tab="全部(365)" key="1">
              <StandardTable
                rowKey="id"
                columns={this.columns}
                data={data || []}
                loading={loading}
                onChangeCombine={(params: object) => this.initData(params)}
                onSelectRow={this.handleSelectRows}
              />
            </TabPane>
            <TabPane tab="已处理" key="2"></TabPane>
            <TabPane tab="未处理" key="3"></TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userInfo, loading }: ConnectState) => ({
  data: userInfo.data,
  loading: loading.models.userInfo,
}))(UserInfoList);
