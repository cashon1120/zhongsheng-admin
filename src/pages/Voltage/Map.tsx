import React, {Component} from 'react';
import BMap from 'BMap';
import {connect} from 'dva';
import {Modal} from 'antd';
import {ConnectProps, ConnectState} from '@/models/connect';

interface IProps extends ConnectProps {
  mapVisible : boolean;
  closeMap : any
}

interface IState {
  loading : boolean;
}

class RescueList extends Component < IProps,
IState > {
  state = {
    loading: false
  };

  componentWillReceiveProps(nextProps : any) {
    setTimeout(() => {
      var map = new BMap.Map("address");
      const point = new BMap.Point(105.548885, 30.547747);
      map.centerAndZoom(point, 12);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      map.enableScrollWheelZoom(); 
      map.enableContinuousZoom();
    }, 20);
  }

  handleOk = () => {
    const {closeMap} = this.props
    closeMap()
  }

  render() {
    const {mapVisible} = this.props
    return (
      <Modal
        width={1000}
        zIndex
        title="位置查看"
        visible={mapVisible}
        onCancel={this.handleOk}
        footer={null}>
        <div
          className="address"
          id="address"
          style={{
          width: '100%',
          height: 500
        }}>1</div>
      </Modal>
    );
  }
}

export default connect(({voltage, loading, global} : ConnectState) => ({data: voltage.rescueData, loading: loading.models.voltage, userData: global.userData}))(RescueList);
