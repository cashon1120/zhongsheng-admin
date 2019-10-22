import request from '@/utils/request';
import {API_URL} from '../../public/config'

export async function fetchOffPower(params: object): Promise<any> {
  return request(API_URL + '/terminalException/recordList', {
    method: 'POST',
    data: params,
  });
}

export async function assign(params: object): Promise<any> {
  return request(API_URL + '/terminalException/assign', {
    method: 'POST',
    data: params,
  });
}

export async function complete(params: object): Promise<any> {
  return request(API_URL + '/terminalException/complete', {
    method: 'POST',
    data: params,
  });
}

export async function fetchVehicleInfo(params: object): Promise<any> {
  return request(API_URL + '/home/statisticsVehicleInfo', {
    method: 'POST',
    data: params,
  });
}

export async function fetchRescueRecord(params: object): Promise<any> {
  return request(API_URL + '/terminalException/rescueRecord', {
    method: 'POST',
    data: params,
  });
}



