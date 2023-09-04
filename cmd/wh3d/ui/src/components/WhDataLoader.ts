import WhStoryBoard from "./WhStoryBoard"
import {AreaInfo, ContainerInfo, StationInfo} from '../sdk/Data';

import {GetRequest, initAreaByNoApi, initContainersByAreaApi, initPlatformsApi} from './api'
import SocketService from "./SocketService";
import {DynamicDisplayInventoryHandler, EventData} from "./DynamicDisplayInventoryHandler";

const api = '/subscribe'

const LoadData = async (sb: WhStoryBoard) => {
    console.log('开始加载区域框')
    // url参数
    let urlParams = GetRequest();

    const {items: areaData} = await initAreaByNoApi({"whNo": urlParams.get("id")})
    let areas = []
    if (!areaData || areaData.length == 0) {
        return
    }
    for (let i = 0; i < areaData.length; i++) {
        let data = areaData[i]
        areas.push(new AreaInfo(data.name).Pos(data.pos.x, data.pos.z).Size(data.size.w, data.size.h))
    }

    if (urlParams.get("id") == 'A511') {
        // 加载地面路标
        // await sb.loadRoads()
        await sb.loadAreas(areas)
    } else if (urlParams.get("id") == "A610") {
        await sb.loadAreas(areas, "17px Microsoft YaHei")
    }

    console.log('开始加载发货站台')

    let id = urlParams.get("id")
    const {items: platformData} = await initPlatformsApi({"whNo": id})
    let stations = []
    if (platformData && platformData.length > 0) {
        for (let i = 0; i < platformData.length; i++) {
            let data = platformData[i]
            stations.push(new StationInfo(data.name).Pos(data.pos.x, data.pos.y).FaceTo(data.faceTo.x, data.faceTo.y, data.faceTo.z))
        }
        await sb.loadStations(stations)
    }

    console.log('开始加载容器')

    await initData(sb, areaData, urlParams.get("id"))

    const url = genWsUrl()
    let ws = SocketService.Instance
    ws.url = url

    console.log(url)

    ws.onmessage = async (msg) => {
        // console.log(msg)
        // debugger
        if (msg == undefined || msg.data == undefined) {
            return
        }
        // console.log(msg)

        let d: EventData = JSON.parse(msg.data)
        console.log(d)
        // 创建-事件处理器，调用公开方法
        await (new DynamicDisplayInventoryHandler()).Handle(d, sb)
    }
    // 连接 ws
    ws.connect()
}

/**
 * 初始化数据
 */
const initData = async (sb: WhStoryBoard, areas: any, wh: any) => {
    // 循环每个区域
    for (let i = 0; i < areas.length; i++) {
        // 初始化区域的托盘信息s
        // if (i > 0) {break}
        initAreaContainers(sb, areas[i].name, areas[i].whId, wh)
    }

}

/**
 * 接口: 初始化区域托盘
 */
const initAreaContainers = (sb: WhStoryBoard, areaName: string, warehouseId: number, whNo: string) => {
    initContainersByAreaApi({
        warehouseId: warehouseId,
        area: areaName,
        deptId: 1,
        orgId: 1,
    }).then(async (res: any) => {
        if (res.code == 200 && res.items && res.items.length > 0) {
            console.log('开始加载区域托盘 ', areaName)
            let containers = []
            let cf = res.items
            for (let i = 0; i < cf.length; i++) {
                // if (i > 0) {break}
                let data = cf[i]
                let c = new ContainerInfo(data.name, data.area).Pos(data.pos.x, data.pos.y, data.pos.z)
                if (data.pos.x + data.pos.y + data.pos.z > 0) {
                    containers.push(c)
                }
            }
            await sb.loadContainers(containers)
        }
    })
}

/**
 * return WebSocket.url
 */
const genWsUrl = (): string => {
    const protocol = location.protocol.startsWith('https') ? 'wss:' : 'ws://'
    const host = location.host
    const url = protocol + host + api
    return url + "?id=A511"
}

/**
 * 唯一的数据入口
 */
export default LoadData
