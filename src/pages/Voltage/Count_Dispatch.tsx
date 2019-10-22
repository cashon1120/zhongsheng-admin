import React, {Component, Fragment} from 'react';
import {Statistic} from 'antd';
//引入echarts主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import {ConnectProps} from '@/models/connect';

interface IProps extends ConnectProps {
  data : any
}

interface IState {
  options : any
}

class Count_Dispatch extends Component < IProps,
IState > {
  state = {
    options: []
  }

  componentWillReceiveProps(nextProps : any) {
    const {data} = nextProps
    var myChart = echarts.init(document.getElementById('main4'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['数量']
      },
      grid: [
        {
          left: '15%',
          bottom: '20%',
          top: '10%',
          right: '5%'
        }
      ],
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitNumber: 1,
      },
      yAxis: {
        type: 'category',
        data: [
          '总异常数',
          '未指派数',
          '已指派数',
        ]
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          itemStyle: {
            normal: {
                // 随机显示
                //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
              
                // 定制显示（按顺序）
                color: function(params: any) { 
                    var colorList = ['#277a9d','#f55d3e','#56c43c']; 
                    return colorList[params.dataIndex] 
                }
            },
        },
          data: [
            data.count,
            data.notAssigned,
            data.assigned,
          ]
        }
      ]
    };
    myChart.setOption(option);
  }

  render() {
    const {data} = this.props
    return (
      <Fragment>
        <Statistic title="总单数" value={data.count}/>
        <div
          id="main4"
          style={{
          width: '90%',
          height: 200
        }}></div>
        {/* <div className="dispatch-wrapper">
          <div style={{width: data.assigned/data.count * 100 + '%'}}>{data.assigned}</div>
          <div className="no-dispatch">{data.notAssigned}</div>
        </div> */}
        <div>派单率: {Math.round(data.assigned / data.count * 100) + '%'}</div>
      </Fragment>
    );
  }
}

export default Count_Dispatch
