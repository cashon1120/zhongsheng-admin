import React, {Component, Fragment} from 'react';
import {Statistic} from 'antd';
//引入echarts主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';
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

class Count_Voltage extends Component < IProps,
IState > {
  state = {
    options: []
  }

  componentWillReceiveProps(nextProps : any) {
    const {data} = nextProps
    var myChart = echarts.init(document.getElementById('main2'));
    // 指定图表的配置项和数据
    const option = {
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['电瓶故障', '电压偏低', '电压正常']
      },
      series : [
          {
              name: '电压状态',
              type: 'pie',
              radius : '70%',
              center: ['45%', '55%'],
              data:[
                  {value:data.alarm, name:'电瓶故障'},
                  {value:data.malfunction, name:'电压偏低'},
                  {value:data.normal, name:'电压正常'}
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
    myChart.setOption(option);
  }

  render() {
    return (
      <Fragment>
        <Statistic title="车辆电压状态情况占比" value=" "/>
        <div
          id="main2"
          style={{
          width: '90%',
          height: 257
        }}></div>
      </Fragment>
    );
  }
}

export default Count_Voltage
