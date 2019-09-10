import React, { Component } from 'react';
import { Card, Button, message, Modal } from 'antd';
import { connect } from 'dva';

import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import { ConnectProps, ConnectState } from '@/models/connect';
import moment from 'moment';
const { confirm } = Modal;

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
      title: '汽车品牌',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '车牌号',
      dataIndex: 'sex',
      key: 'area',
    },
    {
      title: '车主姓名',
      dataIndex: 'birth',
      key: 'birth',
    },
    {
      title: '车主联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '设备失联时间',
      dataIndex: 'school1',
      key: 'school1',
    },
    {
      title: '电瓶断电方式',
      dataIndex: 'school2',
      key: 'school2',
    },
    {
      title: '援救时间',
      dataIndex: 'school3',
      key: 'school3',
    },
    {
      title: '设备恢复正常时间',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '援救人员',
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
        title: '车牌号',
        dataIndex: 'name',
        componentType: 'Input',
      },
      {
        title: '车主姓名',
        dataIndex: 'name',
        componentType: 'Input',
      },
      {
        title: '联系方式',
        dataIndex: 'name',
        componentType: 'Input',
      },
      {
        title: '救援时间',
        dataIndex: 'times',
        componentType: 'RangePicker',
        col: 8,
      },
      {
        title: '救援人',
        dataIndex: 'name',
        componentType: 'Input',
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
    return (
      <PageHeaderWrapper>
        <Card>
          <div>
            <TableSearch
              columns={this.getSerarchColumns()}
              handleSearch={this.handleSearch}
              handleFormReset={this.handleFormReset}
            />
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params: object) => this.initData(params)}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userInfo, loading }: ConnectState) => ({
  data: userInfo.data,
  loading: loading.models.userInfo,
}))(UserInfoList);
