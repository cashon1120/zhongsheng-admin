export const formItemLayout = {
  labelCol: {
    sm: {
      span: 3
    }
  },
  wrapperCol: {
    sm: {
      span: 18
    }
  }
};

export const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 10,
      offset: 3
    }
  }
};

export const API_URL = '/api/'

// 图片上传地址
export const UPLOAD_URL = '/api/upload/file'

// 电压状态枚举
export const VOLTAGE_STATE = [
  {
    value: '正常',
    id: 1
  }, {
    value: '低电压报警',
    id: 2
  }, {
    value: '正设备失联',
    id: 3
  }, {
    value: '断电中',
    title: 4
  }
]

// 性别枚举
export const SEX_TYPE = [
  {
    title: '男',
    id: 1
  }, {
    title: '女',
    id: 2
  }, {
    title: '保密',
    id: 3
  }
]

// 收入枚举
export const ANNUAL_INCOME = [
  {
    title: '10-15万',
    value: '10-15万'
  }, {
    title: '15-30万',
    value: '15-30万'
  }, {
    title: '30-50万',
    value: '30-50万'
  }, {
    title: '50-100万',
    value: '50-100万'
  }, {
    title: '100-500万',
    value: '100-500万'
  }, {
    title: '500万以上',
    value: '500万以上'
  }
]

// 车辆品牌枚举
export const CAR_BRAND = [
  {
    title: '奔驰',
    value: '奔驰'
  }, {
    title: '宝马',
    value: '宝马'
  }
]