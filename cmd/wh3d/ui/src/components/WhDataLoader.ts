import WhStoryBoard from "./WhStoryBoard"
import {AreaInfo, ContainerInfo, StationInfo} from '../sdk/Data';

import {GetRequest, initAreaByNoApi, initContainersByAreaApi, initPlatformsApi} from './api'
import SocketService from "./SocketService";
import {DefaultStorage} from "../sdk/Storage";
import {Station} from "../sdk/models/Station";
import {DynamicDisplayInventoryHandler, EventData} from "./DynamicDisplayInventoryHandler";

const api = '/subscribe'


const LoadData = async (sb: WhStoryBoard) => {
    console.log('开始加载区域框')
    // url参数
    let urlParams = GetRequest();
    console.log(urlParams)

    const {items: areaData} = await initAreaByNoApi({"whNo": urlParams.id})
    let areas = []
    if (!areaData || areaData.length == 0) {
        return
    }
    for (let i = 0; i < areaData.length; i++) {
        let data = areaData[i]
        areas.push(new AreaInfo(data.name).Pos(data.pos.x, data.pos.z).Size(data.size.w, data.size.h))
    }
    await sb.loadAreas(areas)

    console.log('开始加载发货站台')
    const {items: platformData} = await initPlatformsApi({"whNo": urlParams.id})
    let stations = []

    for (let i = 0; i < platformData.length; i++) {
        let data = platformData[i]
        stations.push(new StationInfo(data.name).Pos(data.pos.x, data.pos.y).FaceTo(data.faceTo.x, data.faceTo.y, data.faceTo.z))
    }
    await sb.loadStations(stations)

    console.log('开始加载容器')

    await initData(sb, areaData, urlParams.id)


    // 加载货架
    // let goodshelfs: GoodsShelfInfo[] = []
    // goodshelfs.push(
    //     new GoodsShelfInfo("H").Pos(1, 0).Size(20, 3),
    //
    //     new GoodsShelfInfo("G").Pos(1, 6).Size(20, 3),
    //     new GoodsShelfInfo("F").Pos(1, 9).Size(20, 3),
    //
    //     new GoodsShelfInfo("E").Pos(1, 15).Size(20, 3),
    //     new GoodsShelfInfo("D").Pos(1, 18).Size(20, 3),
    //
    //     new GoodsShelfInfo("C").Pos(1, 26).Size(20, 3),
    //     new GoodsShelfInfo("B").Pos(1, 29).Size(20, 3),
    //
    //     new GoodsShelfInfo("A  ").Pos(1, 35).Size(20, 3),
    //     new GoodsShelfInfo("316").Pos(1, 38).Size(20, 3),
    //     new GoodsShelfInfo("315").Pos(1, 41).Size(20, 3),
    //     new GoodsShelfInfo("314").Pos(1, 44).Size(20, 3),
    //     new GoodsShelfInfo("313").Pos(1, 47).Size(20, 3),
    //     new GoodsShelfInfo("312").Pos(1, 50).Size(20, 3),
    //     new GoodsShelfInfo("311").Pos(1, 53).Size(20, 3),
    //     new GoodsShelfInfo("310").Pos(1, 56).Size(20, 3),
    //     new GoodsShelfInfo("309").Pos(1, 59).Size(20, 3),
    //     new GoodsShelfInfo("308").Pos(1, 62).Size(20, 3),
    //
    //     // right
    //     new GoodsShelfInfo("I").Pos(39, 4).Size(20, 3),
    //     new GoodsShelfInfo("J").Pos(39, 7).Size(20, 3),
    //
    //     new GoodsShelfInfo("I").Pos(39, 13).Size(20, 3),
    //     new GoodsShelfInfo("J").Pos(39, 16).Size(20, 3),
    //
    //     new GoodsShelfInfo("M").Pos(39, 22).Size(20, 3),
    //     new GoodsShelfInfo("N").Pos(39, 25).Size(20, 3),
    //
    //     new GoodsShelfInfo("O").Pos(41, 31).Size(18, 3),
    //     new GoodsShelfInfo("307").Pos(39, 34).Size(20, 3),
    //     new GoodsShelfInfo("306").Pos(39, 37).Size(20, 3),
    //     new GoodsShelfInfo("305").Pos(39, 40).Size(20, 3),
    //     new GoodsShelfInfo("304").Pos(39, 43).Size(20, 3),
    //     new GoodsShelfInfo("303").Pos(39, 46).Size(20, 3),
    //     new GoodsShelfInfo("302").Pos(39, 49).Size(20, 3),
    //     new GoodsShelfInfo("301").Pos(39, 52).Size(20, 3),
    // )
    //
    // await sb.loadGoodShelfs(goodshelfs)

    // 加载BIN
    // await sb.loadBin()

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
    //
    // }, 1000)

    const url = genWsUrl()
    let ws = SocketService.Instance
    ws.url = url

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
const initData = async (sb: WhStoryBoard, areas, wh) => {
    // 循环每个区域
    for (let i = 0; i < areas.length; i++) {
        // 初始化区域的托盘信息s
        // if (i > 0) {break}
        initAreaContainers(sb, areas[i].name, wh)
    }

}

/**
 * 接口: 初始化区域托盘
 */
const initAreaContainers = (sb: WhStoryBoard, areaName: string, whNo: string) => {
    initContainersByAreaApi({
        bu: whNo,
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
