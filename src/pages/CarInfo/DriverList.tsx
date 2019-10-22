import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNew from './DriverAdd';
const {confirm} = Modal;

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

class carInfoList extends Component < IProps,
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
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex : number) => {
        let str = ''
        switch (sex) {
          case 1:
            str = '男'
            break;
          case 2:
            str = '女'
            break;
          default:
            str = '保密'
            break;
        }
        return <span>{str}</span>
      }
    }, {
      title: '身份证号',
      dataIndex: 'identificationNumber',
      key: 'identificationNumber'
    }, {
      title: '车辆数',
      dataIndex: 'lowVoltageAlarmValue',
      key: 'lowVoltageAlarmValue'
    }, {
      title: '联系方式',
      dataIndex: 'concatPhone',
      key: 'concatPhone'
    }, {
      title: '名族',
      dataIndex: 'nationality',
      key: 'nationality'
    }, {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry'
    }, {
      title: '年收入',
      dataIndex: 'annualIncome',
      key: 'annualIncome'
    }, {
      title: '地址',
      dataIndex: 'residentialAddress',
      key: 'residentialAddress'
    }, {
      title: '添加时间',
      dataIndex: 'crtAt',
      key: 'crtAt'
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    }, {
      title: '操作',
      width: 200,
      render: (record : any) => (
        <div className="table-operate">
          <Link to={`/carInfo/driverDetail/${record.id}`}>查看</Link>
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.id)}>删除</a>
        </div>
      )
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
        type: 'carInfo/fetchDriver',
        payload: {
          ...searchParams,
          ...pageInfo,
          ...params
        }
      });
    }
  }

  handleDetail(id : number) {}

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
        title: '车主姓名',
        dataIndex: 'realName',
        componentType: 'Input'
      }, {
        title: '联系方式',
        dataIndex: 'concatPhone',
        componentType: 'Input'
      }, {
        title: '所属行业',
        dataIndex: 'industry',
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
    const {modalVisible, modalData} = this.state
    return (
      <PageHeaderWrapper>
        <Card>
          <div className="flex-container">
            <div className="flex-1">
              <TableSearch
                columns={this.getSerarchColumns()}
                handleSearch={this.handleSearch}
                handleFormReset={this.handleFormReset}/>
            </div>
            <div>
              <Button type="primary" onClick={this.handleAddNew}>添加车主</Button>
            </div>
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Card>
        <AddNew
          modalVisible={modalVisible}
          modalData={modalData}
          onCancel={this.handleTriggerModal}
          onOk={this.handleSubmitModal}/>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({carInfo, loading} : ConnectState) => ({data: carInfo.driverData, loading: loading.models.carInfo}))(carInfoList);
