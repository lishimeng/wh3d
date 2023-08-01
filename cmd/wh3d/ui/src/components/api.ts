import {get} from './request'

const baseURL = 'main'

// 3d数据：初始化托盘信息
export const initContainersByAreaApi = (p: any) => get(baseURL + "/3d/locationconf/initContainers", p)

// 加载区域
export const initAreaByNoApi = (p: any) => get(baseURL + "/3d/areaconf", p)

// 加载站台
export const initPlatformsApi = (p: any) => get(baseURL + "/3d/platformconf", p)

// 加载地板
export const initfloorconfApi = (p) => get(baseURL + "/3d/floorconf", p)

export function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
