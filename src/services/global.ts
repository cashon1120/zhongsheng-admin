import request from '@/utils/request';
import { API_URL} from '../../public/config'

// 民族
export async function fetchNationality(params: object): Promise<{}> {
  return request(API_URL + '/vehicleMember/nationality', {
    method: 'POST',
    data: params,
  });
}


// 行业
export async function fetchProfession(params: object): Promise<{}> {
  return request(API_URL + '/vehicleMember/profession', {
    method: 'POST',
    data: params,
  });
}