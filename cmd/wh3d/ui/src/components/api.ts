import {get} from './request'
import {vary} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

const baseURL = 'main'

// 3d数据：初始化托盘信息
export const initContainersByAreaApi = (p: any) => get(baseURL + "/3d/locationconf/initContainers", p)

// 加载区域
export const initAreaByNoApi = (p: any) => get(baseURL + "/3d/areaconf", p)

// 加载站台
export const initPlatformsApi = (p: any) => get(baseURL + "/3d/platformconf", p)

// 加载地板
export const initfloorconfApi = (p:any) => get(baseURL + "/3d/floorconf", p)

export function GetRequest():Map<string,string> {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest: Map<string, string> = new Map()
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            let kv = str[i].split("=")
            theRequest.set(kv[0], kv[1])
            //theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
