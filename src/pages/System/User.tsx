import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNew from './UserAdd';
import {formatSex} from '../../utils/utils'

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

class User extends Component < IProps,
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
      dataIndex: 'userName',
      key: 'userName'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render : (sex: number) => {
        return <span>{formatSex(sex)}</span>
      }
    }, {
      title: '身份证号码',
      dataIndex: 'idCard',
      key: 'idCard'
    }, {
      title: '联系方式',
      dataIndex: 'phoneNo',
      key: 'phoneNo'
    }, {
      title: '所在部门',
      dataIndex: 'departName',
      key: 'departName'
    }, {
      title: '角色',
      dataIndex: 'realName',
      key: 'realName'
    }, {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime'
    }, {
      title: '操作',
      width: 200,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDisable(record.id)}>禁用</a>
          <a onClick={() => this.handleResetPwd(record.id)}>重置密码</a>
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
        type: 'system/fetchUser',
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

  // 重置密码
  handleResetPwd = (id : string) => {
    const {dispatch} = this.props;
    const callback = (res : any) => {
      if (res.code === 1) {
        message.success(res.msg);
      } else {
        message.error(res.msg)
      }
    };
    confirm({
      title: '系统提示',
      content: '确认要重置该用户密码吗？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'system/resetUserPwd', payload: {
              id
            }, callback});
        }
      }
    });
  };

  // 禁用用户
  handleDisable = (id : string) => {
    const {dispatch} = this.props;
    const callback = (res : any) => {
      if (res.code === 1) {
        message.success(res.msg);
      } else {
        message.error(res.msg)
      }
    };
    confirm({
      title: '系统提示',
      content: '确认要禁用该用户吗？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'system/disableUser', payload: {
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
        title: '用户名称',
        dataIndex: 'realName',
        componentType: 'Input'
      }, {
        title: '手机号',
        dataIndex: 'phoneNo',
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
              <Button type="primary" onClick={this.handleAddNew}>添加用户</Button>
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

export default connect(({system, loading} : ConnectState) => ({data: system.userData, loading: loading.models.system}))(User);
