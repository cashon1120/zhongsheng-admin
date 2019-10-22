import React, {Component} from 'react';
import {Modal, Input, message, Card, Button} from 'antd';
import {connect} from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import {ConnectProps, ConnectState} from '@/models/connect';
import TableSearch from '../../components/TableSearch';
import AddNew from './PeriodicAdd';
const {TextArea} = Input;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
  userData : any
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  modalData: any;
  searchData : {
    [key : string]: any;
  };
  pageInfo : {
    pageSize: number;
    pageNum: number;
  };
  remark: string
}

class RescueList extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    searchData: {},
    modalData: {},
    pageInfo: {
      pageSize: 10,
      pageNum: 1
    },
    remark: ''
  };

  columns = [
    {
      title: '汽车品牌',
      key: 'vehicleName',
      dataIndex: 'vehicleName'
    }, {
      title: '车辆型号',
      key: 'plate',
      dataIndex: 'plate'
    }, {
      title: '保养频率',
      dataIndex: 'concatName',
      key: 'concatName'
    },  {
      title: '操作',
      width: 100,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleSetState(record)}>修改</a>
        </div>
      )
    }
  ];

  componentDidMount() {
    this.initData();
  }

  handleSetState = (record : any) => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
      editData: record
    });
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
        type: 'voltage/fetchRescueRecord',
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
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  TextAreaChange = (e: any) => {
    this.setState({
      remark: e.target.value
    })
  }

// 配置搜索条件
getSerarchColumns = () => {
  const serarchColumns = [
    {
      title: '车辆品牌',
      dataIndex: 'plate',
      componentType: 'Input'
    }, {
      title: '车辆型号',
      dataIndex: 'ownerName',
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

 // 添加新数据
 handleAddNew = () => {
  this.setState({
    modalData: {},
  });
  this.handleTriggerModal();
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
            <Button type="primary"onClick={this.handleAddNew}>保养频率设置</Button>
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
          onOk={this.handleSubmitModal}
        />

      </PageHeaderWrapper>
    );
  }
}

export default connect(({voltage, loading, global} : ConnectState) => ({data: voltage.rescueData, loading: loading.models.voltage, userData: global.userData}))(RescueList);
