import WhStoryBoard from "./WhStoryBoard"
import {AreaInfo, ContainerInfo, StationInfo} from '../sdk/Data';

// TODO 假数据
import * as AreaConfig from './a511_area.json'
import * as StationConfig from './a511_station.json'

import {initAreaByNoApi, initContainersByAreaApi, initPlatformsApi} from './api'

const api = '/subscribe'

const LoadData = async (sb: WhStoryBoard) => {
    console.log('开始加载区域框')

    const {items: areaData} = await initAreaByNoApi({"whNo": "A511"})
    let areas = []

    for (let i = 0; i < areaData.length; i++) {
        let data = areaData[i]
        areas.push(new AreaInfo(data.name).Pos(data.pos.x, data.pos.z).Size(data.size.w, data.size.h))
    }
    await sb.loadAreas(areas)

    console.log('开始加载发货站台')
    const {items: platformData} = await initPlatformsApi({"whNo": "A511"})
    let stations = []

    for (let i = 0; i < platformData.length; i++) {
        let data = platformData[i]
        stations.push(new StationInfo(data.name).Pos(data.pos.x, data.pos.y).FaceTo(data.faceTo.x, data.faceTo.y, data.faceTo.z))
    }
    await sb.loadStations(stations)

    console.log('开始加载容器')

    await initData(sb, areaData)

    // console.log(genWsUrl())
    // let containers = []
    // let cf = ContainerConfig.containers
    // for (let i = 0; i < cf.length; i++) {
    //     let data = cf[i]
    //     let c = new ContainerInfo(data.name, data.area).Pos(data.pos.x, data.pos.y, data.pos.z)
    //     containers.push(c)
    // }
    // await sb.loadContainers(containers)

    // setInterval(() => {
    //     // TODO 更新每个area的托盘变动，或启动websocket监听托盘变动
    //     // 连接 WebSocket service
    //     const url = genWsUrl()
    //     let ws = SocketService.Instance
    //     ws.url = url
    //
    //     ws.onmessage = (msg) => {
    //         if (msg == undefined || msg.data == undefined) {
    //             return
    //         }
    //         console.log(msg)
    //         let d = JSON.parse(msg.data)
    //         console.log(d)
    //     }
    //
    //     ws.connect()
    // }, 1000)
    setInterval(() => {
        // TODO 更新每个站台状态变动
    }, 1000)
}


/**
 * 初始化数据
 */
const initData = async (sb: WhStoryBoard, areas) => {
    // 循环每个区域
    for (let i = 0; i < areas.length; i++) {
        // 初始化区域的托盘信息s
        // if (i > 0) {break}
        initAreaContainers(sb, areas[i].name)
    }

}

/**
 * 接口: 初始化区域托盘
 */
const initAreaContainers = (sb: WhStoryBoard, areaName: string) => {
    initContainersByAreaApi({
        bu: 'A511',
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
                containers.push(c)
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
    return url
}

/**
 * 唯一的数据入口
 */
export default LoadData
