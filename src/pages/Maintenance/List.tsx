import React, {Component} from 'react';
import {Modal, Input, message, Card} from 'antd';
import {connect} from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import {ConnectProps, ConnectState} from '@/models/connect';
import TableSearch from '../../components/TableSearch';
const {TextArea} = Input;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
  userData : any
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  editData : {
    [key : string]: any
  };
  searchData : {
    [key : string]: any;
  };
  processings : any[]
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
    editData: {
      id: 0,
      vehicleName: '',
      exceptionCode: 0,
      exceptionTime: '',
      concatName: '',
      concatPhone: '',
      lat: '',
      lng: '',
      plate: '',
      personnelName: ''
    },
    processings: [],
    pageInfo: {
      pageSize: 10,
      pageNum: 1
    },
    remark: ''
  };

  columns = [
    {
      title: '车牌号',
      key: 'plate',
      dataIndex: 'plate'
    }, 
    {
      title: '汽车品牌',
      key: 'vehicleName',
      dataIndex: 'vehicleName'
    }, {
      title: '车辆型号',
      key: 'vehicleName',
      dataIndex: 'vehicleName'
    }, {
      title: '实时公里数',
      dataIndex: 'concatName',
      key: 'concatName'
    }, {
      title: '下次保养公里数',
      dataIndex: 'concatPhone',
      key: 'concatPhone'
    }, {
      title: '下次保养时间',
      dataIndex: 'exceptionTime',
      key: 'exceptionTime'
    }, {
      title: '保养状态',
      dataIndex: 'powerOffMode',
      key: 'powerOffMode'
    },{
      title: '操作',
      width: 100,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleSetState(record)}>{record.state === 1
              ? '查看'
              : '保养汇报'}</a>
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

  handleOk = (e : any) => {
    const {dispatch} = this.props
    const {editData, remark} = this.state
    if (remark === '') {
      message.error('请输入汇报内容')
      return
    }
    const callback = (res : any) => {
      if (res.code === 1) {
        this.initData()
        this.setState({modalVisible: false});
      } else {
        message.error(res.msg)
      }
    }
    if (dispatch) {
      dispatch({
        type: 'voltage/complete',
        payload: {
          id: editData.id,
          processingRemark: remark
        },
        callback
      });
    }

  };

  handleCancel = (e : any) => {
    this.setState({modalVisible: false});
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
      title: '车牌号',
      dataIndex: 'plate',
      componentType: 'Input'
    }, {
      title: '车主姓名',
      dataIndex: 'ownerName',
      componentType: 'Input'
    }, {
      title: '车主联系方式',
      dataIndex: 'concatPhone',
      componentType: 'Input'
    },{
      title: '保养状态',
      dataIndex: 'personnelName',
      componentType: 'Select',
      dataSource: [
        {
          title: '保养已超期',
          value: 1
        }, {
          title: '保养时间临近',
          value: 2
        }, {
          title: '正常',
          value: 3
        }
      ]
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
    const {modalVisible, editData} = this.state
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
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Card>
        <Modal
          title="救援详情"
          visible={modalVisible}
          confirmLoading={loading}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <h3>{editData.plate}</h3>
          {editData.vehicleName}
          {/* {formartVoltageState(editData.exceptionCode)} */}
          <ul className="vlotageDetail">
            <li>
              <span className="lable">救援人员:</span>
              {editData.personnelName}
            </li>
            <li>
              <span className="lable">结果汇报:</span>
              <div className="selectWrapper">
                <TextArea onChange={(e) => this.TextAreaChange(e)}/>
              </div>
            </li>
          </ul>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({voltage, loading, global} : ConnectState) => ({data: voltage.rescueData, loading: loading.models.voltage, userData: global.userData}))(RescueList);
