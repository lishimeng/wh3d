import {baseURL, get, post, put} from '/@/utils/request';

// 获取库位配置列表
export const getfloorconfListApi = (p) => get(baseURL + '/floorconf/pc', p)

// 修改库位配置
export const editfloorconfApi = (p) => put(baseURL + '/floorconf', p)

