/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path : string) : boolean => reg.test(path);

const isAntDesignPro = () : boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = () : boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 限制非法字符输入,[中文,英文,数字,_]
const legalStr = /^[A-Za-z0-9\u4e00-\u9fa5\_\#\.\.\-\·\ \:\/]+$/;

// 判断性别
const formatSex = (sexType : number) => {
  let sex = ''
  switch (sexType) {
    case 1:
      sex = '男'
      break;
    case 2:
      sex = '女'
      break;
    default:
      sex = '保密'
      break;
  }
  return sex
}

// 根据身份证算年龄
const getAge = (identityCard : any) => {
  let len = (identityCard + "").length;
  if (len == 0) {
    return 0;
  } else {
    if ((len != 15) && (len != 18)) {
      return 0
    }
  };
  let strBirthday = "";
  if (len == 18) { //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday = identityCard. substr(6, 4) +"/" + identityCard. substr(10, 2) +"/" + identityCard. substr(12, 2);
  }
  if
  (len == 15) {strBirthday = "19" + identityCard. substr(6, 2) +"/" + identityCard. substr(8, 2) +"/" + identityCard. substr(10, 2);
  }
  //时间字符串里，必须是“/”
  let
  birthDate = new Date(strBirthday);let
  nowDateTime = new Date();let
  age = nowDateTime. getFullYear() -birthDate. getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if
  (nowDateTime. getMonth() <birthDate. getMonth() ||(nowDateTime. getMonth() ==birthDate. getMonth() &&nowDateTime. getDate() <birthDate. getDate())) {age--;
  }
  return
  age
}

export {
isAntDesignProOrDev, isAntDesignPro, isUrl, legalStr, formatSex, getAge
};
