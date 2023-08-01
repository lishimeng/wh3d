import {baseURL, del, get, post} from '/@/utils/request';

// 添加库位配置
export const addlocationconfApi = (p) => post(baseURL + '/locationconf', p)

// 获取库位配置列表
export const getlocationconfListApi = (p) => get(baseURL + '/locationconf', p)

// id获取库位配置
export const getlocationconfByIdApi = (p) => get(baseURL + '/locationconf/' + p.id, p)

// 修改库位配置
export const editlocationconfApi = (p) => post(baseURL + '/locationconf/update/location/conf', p)

// 根据id删除库位配置
export const dellocationconfByIdApi = (p) => del(baseURL + '/locationconf/' + p.id, p)

// 自动计算库位相对于区域的绝对xzy轴坐标
export const calculateposlocationApi = (p) => get(baseURL + "/locationconf/calculate/pos/location", p)
