import React, { Component } from 'react';
import { Card, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import 'antd/dist/antd.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import { ConnectProps, ConnectState } from '@/models/connect';
import AddNew from './CarAdd';
import {VOLTAGE_STATE} from '../../../public/config'

const { confirm } = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean;
}

interface IState {
  loading: boolean;
  modalVisible: boolean;
  modalData: any;
  searchData: {
    [key: string]: any;
  };
  pageInfo: {
    pageSize: number;
    pageNum: number;
  };
}

class CarList extends Component<IProps, IState> {
  state = {
    loading: false,
    modalVisible: false,
    modalData: {},
    searchData: {},
    pageInfo: {
      pageSize: 10,
      pageNum: 1,
    },
  };

  columns = [
    {
      title: '汽车品牌',
      dataIndex: 'brands',
      key: 'brands',
    },
    {
      title: '车牌号',
      dataIndex: 'plate',
      key: 'plate',
    },{
      title: '车架号',
      dataIndex: 'frameNumber',
      key: 'frameNumber',
    },{
      title: '车主姓名',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },{
      title: '联系方式',
      dataIndex: 'ownerContact',
      key: 'ownerContact',
    },{
      title: '车载设备ID',
      dataIndex: 'vehicleEquipmentId',
      key: 'vehicleEquipmentId',
    },{
      title: '实时公里数',
      dataIndex: 'initialMileage',
      key: 'initialMileage',
    },{
      title: '电压状态',
      dataIndex: 'voltageState',
      key: 'voltageState',
      render: (voltageState: number) => {
        let state = ''
        VOLTAGE_STATE.forEach((item: any) => {
          if(item.id === voltageState){
            state = item. value
          }
        })
        return <span>{state}</span>
      }
    },
    {
      title: '操作',
      width: 200,
      render: (record: any) => (
        <div className="table-operate">
          <Link to={`/carInfo/carDetail/${record.id}`}>查看</Link>
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.id)}>删除</a>
        </div>
      ),
    },
  ];

  componentDidMount() {
    this.initData();
  }

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
        type: 'carInfo/fetchCar',
        payload: {
          ...searchParams,
          ...pageInfo,
          ...params,
        },
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

  // 添加新数据
  handleAddNew = () => {
    this.setState({
      modalData: {},
    });
    this.handleTriggerModal();
  };

  // 编辑数据
  handleEdit = (record: any) => {
    this.setState({
      modalData: {
        ...record,
      },
    });
    this.handleTriggerModal();
  };

  // 删除数据
  handleDel = (id: string) => {
    const { dispatch } = this.props;
    const callback = (res: any) => {
      if (res.code === 1) {
        message.success('操作成功');
        this.initData()
      }else{
        message.error(res.msg)
      }
    };
    confirm({
      title: '系统提示',
      content: '确认要删除该记录吗？',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'carInfo/delVoltage',
            payload: {
              id,
            },
            callback,
          });
        }
      },
    });
  };

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '电频型号',
        dataIndex: 'model',
        componentType: 'Input',
      },
      {
        title: '车辆型号',
        dataIndex: 'type',
        componentType: 'Input',
      },
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values: any) => {
    const { searchData } = this.state;
    this.setState(
      {
        searchData: {
          ...searchData,
          ...values
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

  render() {
    const { data, loading } = this.props;
    const {modalVisible, modalData} = this.state
    return (
      <PageHeaderWrapper>
        <Card>
          <div className="flex-container">
            <div className="flex-1">
              <TableSearch
                columns={this.getSerarchColumns()}
                handleSearch={this.handleSearch}
                handleFormReset={this.handleFormReset}
              />
            </div>
            <div>
                <Button type="primary"onClick={this.handleAddNew}>添加车辆</Button>
            </div>
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params: object) => this.initData(params)}
          />
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

export default connect(({ carInfo, loading }: ConnectState) => ({
  data: carInfo.carData,
  loading: loading.models.carInfo,
}))(CarList);
