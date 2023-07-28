import {get} from './request'

const baseURL = 'main'

// 3d数据：初始化托盘信息
export const initContainersByAreaApi = (p: any) => get(baseURL + "/3d/initContainers/" + p.area, p)

// 加载区域
export const initAreaByNoApi = (p: any) => get(baseURL + "/3d/areaconf", p)

// 加载站台

export const initPlatformsApi = (p: any) => get(baseURL + "/3d/platformConf", p)
