import { Reducer } from 'redux';
import { Effect } from './connect.d';
import { fetchVoltage} from '@/services/carInfo';

export interface GlobalModelState {
  voltageData: any;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchVoltage: Effect
  };
  reducers: {
    saveVoltageData: Reducer<{}>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    voltageData: []
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
  },

  reducers: {
    saveVoltageData(state, { payload }) {
      console.log(payload.data.list)
      return {
        ...state,
        voltageData: payload.data.list,
      };
    },
  },
};

export default GlobalModel;
