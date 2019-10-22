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
  percent : string
  allCount : any
}

class Count_Vehicle extends Component < IProps,
IState > {
  state = {
    percent: '',
    allCount: 0,
  }

  componentWillReceiveProps(nextProps : any) {
    const {data} = nextProps
    var myChart = echarts.init(document.getElementById('main1'));

    window.onresize = function () {
      myChart.resize();
    }

    let xData : any = []
    let yData : any = []
    let allCount = 0
    data.sort(function (a : any, b : any) {
      return b.key - a.key
    })
    if (data.length > 0) {
      const [thisMonth,
        lastMonth] = [
        parseInt(data[0].value, 10),
        parseInt(data[1].value, 10)
      ]
      const percent = thisMonth >= lastMonth
        ? (thisMonth / lastMonth - 1) * 100
        : -(1 - thisMonth / lastMonth) * 100
      this.setState({
        percent: Math.round(percent) + '%'
      })
    }
    data.forEach((item : any) => {
      xData.unshift(item.key)
      yData.unshift(item.value)
      allCount = allCount + parseInt(item.value, 10)
    })
    this.setState({allCount})
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      grid: [
        {
          left: '5%',
          bottom: '20%',
          top: '10%',
          right: '5%'
        }
      ],
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
    const {allCount, percent} = this.state
    return (
      <Fragment>
        <Statistic title="累计车辆总数" value={allCount}/>
        <div
          id="main1"
          style={{
          width: '90%',
          height: 200
        }}></div>
        <div>月增长: {percent}</div>
      </Fragment>
    );
  }
}

export default Count_Vehicle
