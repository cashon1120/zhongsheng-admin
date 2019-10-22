import { Reducer } from 'redux';
import { Effect } from 'dva';
import { fetchOffPower, assign, complete, fetchVehicleInfo, fetchRescueRecord } from '@/services/voltage';

export interface VoltageModelState {
  data: any;
  rescueData: any
}

export interface ModelType {
  namespace: string;
  state: VoltageModelState;
  effects: {
    fetchOffPower: Effect;
    assign: Effect;
    complete: Effect;
    fetchVehicleInfo: Effect;
    fetchRescueRecord: Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
    saveRescueData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'voltage',

  state: {
    data: [],
    rescueData: []
  },

  effects: {
    *fetchOffPower({ payload }, { put, call }) {
      const response = yield call(fetchOffPower, payload);
      if (response) {
        yield put({
          type: 'saveData',
          payload: response,
        });
      }
    },
    *assign({ payload, callback }, { call }) {
      const response = yield call(assign, payload);
      if (callback) {
        callback(response);
      }
    },

    *complete({ payload, callback }, { call }) {
      const response = yield call(complete, payload);
      if (callback) {
        callback(response);
      }
    },
    
    *fetchVehicleInfo({ payload, callback }, { call }) {
      const response = yield call(fetchVehicleInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    
    *fetchRescueRecord({ payload, callback }, { put, call}) {
      const response = yield call(fetchRescueRecord, payload);
      if (response) {
        yield put({
          type: 'saveRescueData',
          payload: response,
        });
      }
    },

  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: payload.data,
      };
    },

    saveRescueData(state, { payload }) {
      return {
        ...state,
        rescueData: payload.data,
      };
    },
  },
};

export default LoginModel;
