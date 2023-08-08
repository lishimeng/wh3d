import {baseURL, get, post, put} from '/@/utils/request';

// 获取站台配置列表
export const getplatformconfListApi = (p) => get(baseURL + '/platformconf/pc', p)

// 修改站台配置
export const editplatformconfApi = (p) => put(baseURL + '/platformconf', p)

