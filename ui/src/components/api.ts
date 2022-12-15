import { get } from './request'

const baseURL = 'main'

// 3d数据：初始化托盘信息
export const initContainersByAreaApi = (p: any) => get(baseURL + "/3d/initContainers/"+p.area, p)