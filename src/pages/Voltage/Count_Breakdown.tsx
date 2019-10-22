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
  allCount : number
}

class Count_Breakdown extends Component < IProps,
IState > {
  state = {
    allCount: 0
  }

  componentWillReceiveProps(nextProps : any) {
    const {data} = nextProps
    var myChart = echarts.init(document.getElementById('main3'));
    window.onresize = function () {
      myChart.resize();
    }
    let xData : any = []
    let yData : any = []
    let allCount = 0
    data.sort(function (a : any, b : any) {
      return b.key - a.key
    })
    data.forEach((item : any) => {
      xData.unshift(item.key)
      yData.unshift(item.value)
      allCount = allCount + parseInt(item.value, 10)
    })
    this.setState({
      allCount
    })
    myChart.setOption({
      xAxis: {
        data: xData
      },
      grid: [
        {
          left: '5%',
          bottom: '20%',
          top: '10%',
          right: '5%'
        }
      ],
      yAxis: { type: 'value', splitNumber:1},
      series: [
        {
          name: '数量',
          type: 'bar',
          data: yData
        }
      ]
    })
  }

  render() {
    const {allCount} = this.state
    return (
      <Fragment>
        <Statistic title="故障电瓶数量" value={allCount}/>
        <div
          id="main3"
          style={{
          width: '90%',
          height: 200
        }}></div>
        <div>月平均数量: {allCount/12}</div>
      </Fragment>
    );
  }
}

export default Count_Breakdown
