import request from '@/utils/request';
import { API_URL} from '../../public/config'

export async function login(params: object): Promise<any> {
  return request(API_URL + '/login', {
    method: 'POST',
    data: params,
  });
}
