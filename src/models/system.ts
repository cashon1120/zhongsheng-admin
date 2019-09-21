import {Reducer} from 'redux';
import {Effect} from 'dva';
import {
  fetchPartment,
  addPartment,
  updatePartment,
  delPartment,
  fetchRole,
  addRole,
  updateRole,
  delRole,
  fetchUser,
  addUser,
  updateUser,
  disableUser,
  resetUserPwd
} from '@/services/system';

export interface SystemModelState {
  partmentData : any;
  roleData : any;
  userData : any
}

export interface ModelType {
  namespace : string;
  state : SystemModelState;
  effects : {
    fetchPartment: Effect;
    addPartment: Effect;
    updatePartment: Effect;
    delPartment: Effect;
    fetchRole: Effect;
    addRole: Effect;
    updateRole: Effect;
    delRole: Effect;
    fetchUser: Effect;
    addUser: Effect;
    updateUser: Effect;
    disableUser: Effect;
    resetUserPwd: Effect
  };
  reducers : {
    savePartmentData: Reducer < {} >;
    saveRoleData: Reducer < {} >;
    saveUserData: Reducer < {} >;
  };
}

const LoginModel : ModelType = {
  namespace: 'system',

  state: {
    partmentData: [],
    roleData: [],
    userData: []
  },

  effects: {
    *fetchPartment({
      payload
    }, {put, call}) {
      const response = yield call(fetchPartment, payload);
      if (response) {
        yield put({type: 'savePartmentData', payload: response});
      }
    },
    *addPartment({
      payload,
      callback
    }, {call}) {
      const response = yield call(addPartment, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePartment({
      payload,
      callback
    }, {call}) {
      const response = yield call(updatePartment, payload);
      if (callback) {
        callback(response);
      }
    },
    *delPartment({
      payload,
      callback
    }, {call}) {
      const response = yield call(delPartment, payload);
      if (callback) {
        callback(response);
      }
    },
    // 角色
    *fetchRole({
      payload
    }, {put, call}) {
      const response = yield call(fetchRole, payload);
      if (response) {
        yield put({type: 'saveRoleData', payload: response});
      }
    },
    *addRole({
      payload,
      callback
    }, {call}) {
      const response = yield call(addRole, payload);
      if (callback) {
        callback(response);
      }
    },
    *delRole({
      payload,
      callback
    }, {call}) {
      const response = yield call(delRole, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateRole({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateRole, payload);
      if (callback) {
        callback(response);
      }
    },

    // 用户
    *fetchUser({
      payload
    }, {put, call}) {
      const response = yield call(fetchUser, payload);
      if (response) {
        yield put({type: 'saveUserData', payload: response});
      }
    },
    *addUser({
      payload,
      callback
    }, {call}) {
      const response = yield call(addUser, payload);
      if (callback) {
        callback(response);
      }
    },
    *disableUser({
      payload,
      callback
    }, {call}) {
      const response = yield call(disableUser, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateUser({
      payload,
      callback
    }, {call}) {
      const response = yield call(updateUser, payload);
      if (callback) {
        callback(response);
      }
    },
    *resetUserPwd({
      payload,
      callback
    }, {call}) {
      const response = yield call(resetUserPwd, payload);
      if (callback) {
        callback(response);
      }
    }
  },

  reducers: {
    savePartmentData(state, {payload}) {
      return {
        ...state,
        partmentData: payload.data
      };
    },
    saveRoleData(state, {payload}) {
      return {
        ...state,
        roleData: payload.data
      };
    },
    saveUserData(state, {payload}) {
      return {
        ...state,
        userData: payload.data
      };
    }
  }
};

export default LoginModel;
