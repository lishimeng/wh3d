import {baseURL, get, post, put} from '/@/utils/request';

// 获取库位配置列表
export const getareaconfListApi = (p) => get(baseURL + '/areaconf/pc', p)

// 修改库位配置
export const editareaconfApi = (p) => put(baseURL + '/areaconf', p)

