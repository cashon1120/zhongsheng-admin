import {Reducer} from 'redux';
import {Effect} from './connect.d';
import {fetchVoltage, fetchType} from '@/services/carInfo';
import {fetchRole, fetchPartment} from '@/services/system';
import {fetchProfession, fetchNationality} from '@/services/global'

export interface GlobalModelState {
  collapsed : boolean;
  voltageData : any;
  partmentData : any;
  roleData : any;
  typeData : any;
  professionData : any;
  nationalityData : any;
}

export interface GlobalModelType {
  namespace : 'global';
  state : GlobalModelState;
  effects : {
    fetchVoltage: Effect;
    fetchRole: Effect;
    fetchPartment: Effect;
    fetchType: Effect;
    fetchProfession: Effect;
    fetchNationality: Effect;
  };
  reducers : {
    saveVoltageData: Reducer < {} >;
    saveRoleData: Reducer < {} >;
    savePartmentData: Reducer < {} >;
    saveTypeData: Reducer < {} >;
    saveProfessionData: Reducer < {} >;
    saveNationalityData: Reducer < {} >;
  };
}

const GlobalModel : GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    voltageData: [],
    roleData: [],
    partmentData: [],
    typeData: [],
    professionData: [],
    nationalityData: []
  },

  effects: {
    *fetchVoltage({
      payload
    }, {put, call}) {
      const response = yield call(fetchVoltage, payload);
      if (response) {
        yield put({type: 'saveVoltageData', payload: response});
      }
    },
    *fetchType({
      payload,
      callback
    }, {put, call}) {
      const response = yield call(fetchType, payload);
      if (response) {
        yield put({type: 'saveTypeData', payload: response});
      }
      if (callback) {
        callback(response)
      }
    },
    *fetchRole({
      payload
    }, {put, call}) {
      const response = yield call(fetchRole, payload);
      if (response) {
        yield put({type: 'saveRoleData', payload: response});
      }
    },
    *fetchPartment({
      payload
    }, {put, call}) {
      const response = yield call(fetchPartment, payload);
      if (response) {
        yield put({type: 'savePartmentData', payload: response});
      }
    },
    *fetchProfession({
      payload
    }, {put, call}) {
      const response = yield call(fetchProfession, payload);
      if (response) {
        yield put({type: 'saveProfessionData', payload: response});
      }
    },
    *fetchNationality({
      payload
    }, {put, call}) {
      const response = yield call(fetchNationality, payload);
      if (response) {
        yield put({type: 'saveNationalityData', payload: response});
      }
    }
  },

  reducers: {
    saveVoltageData(state, {payload}) {
      return {
        ...state,
        voltageData: payload.data.list
      };
    },
    savePartmentData(state, {payload}) {
      return {
        ...state,
        partmentData: payload.data.list
      };
    },
    saveRoleData(state, {payload}) {
      return {
        ...state,
        roleData: payload.data.list
      };
    },
    saveTypeData(state, {payload}) {
      return {
        ...state,
        typeData: payload.data.list
      };
    },
    saveProfessionData(state, {payload}) {
      return {
        ...state,
        professionData: payload.data
      };
    },
    saveNationalityData(state, {payload}) {
      return {
        ...state,
        nationalityData: payload.data
      };
    }
  }
};

export default GlobalModel;
