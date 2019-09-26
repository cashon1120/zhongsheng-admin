import request from '@/utils/request';
import {API_URL} from '../../public/config'

export async function fetchVoltage(params: object): Promise<any> {
  return request(API_URL + '/battery/batteryList', {
    method: 'POST',
    data: params,
  });
}

export async function addVoltage(params: object): Promise<any> {
  return request(API_URL + '/battery/saveBattery', {
    method: 'POST',
    data: params,
  });
}


export async function delVoltage(params: object): Promise<any> {
  return request(API_URL + '/battery/delBattery', {
    method: 'POST',
    data: params,
  });
}

export async function updateVoltage(params: object): Promise<{}> {
  return request(API_URL + '/battery/editBattery', {
    method: 'POST',
    data: params,
  });
}
// 车辆
export async function fetchCar(params: object): Promise<any> {
  return request(API_URL + '/vehicle/vehicleList', {
    method: 'POST',
    data: params,
  });
}

export async function addCar(params: object): Promise<any> {
  return request(API_URL + '/vehicle/saveVehicle', {
    method: 'POST',
    data: params,
  });
}


export async function delCar(params: object): Promise<any> {
  return request(API_URL + '/vehicle/delVehicle', {
    method: 'POST',
    data: params,
  });
}


export async function detailCar(params: object): Promise<any> {
  return request(API_URL + '/vehicle/vehicleInfo', {
    method: 'POST',
    data: params,
  });
}

export async function updateCar(params: object): Promise<{}> {
  return request(API_URL + '/vehicle/editVehicle', {
    method: 'POST',
    data: params,
  });
}

// 车主
export async function fetchDriver(params: object): Promise<any> {
  return request(API_URL + '/vehicleMember/vehicleMemberList', {
    method: 'POST',
    data: params,
  });
}

export async function addDriver(params: object): Promise<any> {
  return request(API_URL + '/vehicleMember/saveVehicleMember', {
    method: 'POST',
    data: params,
  });
}


export async function delDriver(params: object): Promise<any> {
  return request(API_URL + '/battery/delBattery', {
    method: 'POST',
    data: params,
  });
}


export async function detailDriver(params: object): Promise<any> {
  return request(API_URL + '/vehicleMember/vehicleMemberInfo', {
    method: 'POST',
    data: params,
  });
}

export async function updateDriver(params: object): Promise<{}> {
  return request(API_URL + '/vehicleMember/editVehicleMember', {
    method: 'POST',
    data: params,
  });
}



// 
export async function fetchType(params: object): Promise<any> {
  return request(API_URL + '/vehicleModel/vehicleModelList', {
    method: 'POST',
    data: params,
  });
}

export async function addType(params: object): Promise<any> {
  return request(API_URL + '/vehicleModel/saveVehicleModel', {
    method: 'POST',
    data: params,
  });
}


export async function updateType(params: object): Promise<any> {
  return request(API_URL + '/vehicleModel/editVehicleModel', {
    method: 'POST',
    data: params,
  });
}


export async function delType(params: object): Promise<{}> {
  return request(API_URL + '/vehicleModel/delVehicleModel', {
    method: 'POST',
    data: params,
  });
}

export async function fetchFactoryList(params: object): Promise<{}> {
  return request(API_URL + '/battery/batteryFactoryList', {
    method: 'POST',
    data: params,
  });
}

