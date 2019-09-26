import {Reducer} from 'redux';
import {Effect} from 'dva';
import {
  fetchVoltage,
  addVoltage,
  updateVoltage,
  delVoltage,
  fetchCar,
  addCar,
  updateCar,
  delCar,
  detailCar,
  fetchDriver,
  addDriver,
  updateDriver,
  delDriver,
  detailDriver,
  fetchType,
  addType,
  updateType,
  delType,
  fetchFactoryList
} from '@/services/carInfo';

export interface CarInfoModelState {
  voltageData : any;
  carData : any;
  driverData : any
  typeData: any
  factoryData: any
}

export interface ModelType {
  namespace : string;
  state : CarInfoModelState;
  effects : {
    fetchVoltage: Effect;
    addVoltage: Effect;
    delVoltage: Effect;
    updateVoltage: Effect;
    fetchCar: Effect;
    addCar: Effect;
    updateCar: Effect;
    delCar: Effect;
    detailCar: Effect;
    fetchDriver: Effect;
    addDriver: Effect;
    updateDriver: Effect;
    delDriver: Effect;
    detailDriver: Effect;
    fetchType: Effect;
    addType: Effect;
    delType: Effect;
    updateType: Effect;
    fetchFactoryList: Effect;
  };
  reducers : {
    saveVoltageData: Reducer < {} >;
    saveCarData: Reducer < {} >;
    saveDriverData: Reducer < {} >;
    saveTypeData: Reducer < {} >
    saveFactoryData: Reducer < {} >
  };
}

const LoginModel : ModelType = {
  namespace: 'carInfo',

  state: {
    voltageData: [],
    carData: [],
    driverData: [],
    typeData: [],
    factoryData: []
  },

  effects: {
    *fetchVoltage({
      payload,
      callback
    }, {put, call}) {
      const response = yield call(fetchVoltage, payload);
      if (response) {
        yield put({type: 'saveVoltageData', payload: response});
      }
      if(callback){
        callback(response)
      }
    },
    *addVoltage({
      payload,
      callback
    }, {call}) {
      const response = yield call(addVoltage, payload);
      if (callback) {
        callback(response);
      }
    },
    *delVoltage({
      payload,
      callback
    }, {call}) {
      const response = yield call(delVoltage, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateVoltage({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateVoltage, payload);
      if (callback) {
        callback(response);
      }
    },
    // 车辆
    *fetchCar({
      payload
    }, {put, call}) {
      const response = yield call(fetchCar, payload);
      if (response) {
        yield put({type: 'saveCarData', payload: response});
      }
    },
    *addCar({
      payload,
      callback
    }, {call}) {
      const response = yield call(addCar, payload);
      if (callback) {
        callback(response);
      }
    },
    *delCar({
      payload,
      callback
    }, {call}) {
      const response = yield call(delCar, payload);
      if (callback) {
        callback(response);
      }
    },
    *detailCar({
      payload,
      callback
    }, {call}) {
      const response = yield call(detailCar, payload);
      if (callback) {
        console.log(1)
        callback(response);
      }
    },
    *updateCar({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateCar, payload);
      if (callback) {
        callback(response);
      }
    },

    // 车主
    *fetchDriver({
      payload
    }, {put, call}) {
      const response = yield call(fetchDriver, payload);
      if (response) {
        yield put({type: 'saveDriverData', payload: response});
      }
    },
    *addDriver({
      payload,
      callback
    }, {call}) {
      const response = yield call(addDriver, payload);
      if (callback) {
        callback(response);
      }
    },
    *delDriver({
      payload,
      callback
    }, {call}) {
      const response = yield call(delDriver, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateDriver({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateDriver, payload);
      if (callback) {
        callback(response);
      }
    },
    *detailDriver({
      payload,
      callback
    }, {call}) {
      const response = yield call(detailDriver, payload);
      if (callback) {
        callback(response);
      }
    },
    // 车型
    *fetchType({
      payload
    }, {put, call}) {
      const response = yield call(fetchType, payload);
      if (response) {
        yield put({type: 'saveTypeData', payload: response});
      }
    },
    *addType({
      payload,
      callback
    }, {call}) {
      const response = yield call(addType, payload);
      if (callback) {
        callback(response);
      }
    },
    *delType({
      payload,
      callback
    }, {call}) {
      const response = yield call(delType, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateType({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateType, payload);
      if (callback) {
        callback(response);
      }
    },
    *fetchFactoryList({
      payload,
      callback
    }, {put, call}) {
      const response = yield call(fetchFactoryList, payload);
      if (response) {
        yield put({type: 'saveFactoryData', payload: response});
      }
    }
  },

  reducers: {
    saveVoltageData(state, {payload}) {
      return {
        ...state,
        voltageData: payload.data
      };
    },
    saveCarData(state, {payload}) {
      return {
        ...state,
        carData: payload.data
      };
    },
    saveDriverData(state, {payload}) {
      return {
        ...state,
        driverData: payload.data
      };
    },
    saveTypeData(state, {payload}) {
      return {
        ...state,
        typeData: payload.data
      };
    },
    saveFactoryData(state, {payload}) {
      return {
        ...state,
        factoryData: payload.data
      };
    }
  }
};

export default LoginModel;
