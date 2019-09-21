import { Reducer } from 'redux';
import { Effect } from './connect.d';
import { fetchVoltage } from '@/services/carInfo';
import { fetchRole, fetchPartment } from '@/services/system';

export interface GlobalModelState {
  collapsed: boolean;
  voltageData: any;
  partmentData: any;
  roleData: any;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchVoltage: Effect;
    fetchRole: Effect
    fetchPartment: Effect
  };
  reducers: {
    saveVoltageData: Reducer<{}>;
    saveRoleData: Reducer<{}>;
    savePartmentData: Reducer<{}>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    voltageData: [],
    roleData: [],
    partmentData: []
  },

  effects: {
    *fetchVoltage({ payload }, { put, call }) {
      const response = yield call(fetchVoltage, payload);
      if (response) {
        yield put({
          type: 'saveVoltageData',
          payload: response,
        });
      }
    },
    *fetchRole({ payload }, { put, call }) {
      const response = yield call(fetchRole, payload);
      if (response) {
        yield put({
          type: 'saveRoleData',
          payload: response,
        });
      }
    },
    *fetchPartment({ payload }, { put, call }) {
      const response = yield call(fetchPartment, payload);
      if (response) {
        yield put({
          type: 'savePartmentData',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveVoltageData(state, { payload }) {
      return {
        ...state,
        voltageData: payload.data.list,
      };
    },
    savePartmentData(state, { payload }) {
      return {
        ...state,
        partmentData: payload.data.list,
      };
    },
    saveRoleData(state, { payload }) {
      return {
        ...state,
        roleData: payload.data.list,
      };
    },
  },
};

export default GlobalModel;
