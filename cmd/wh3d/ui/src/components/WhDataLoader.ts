import WhStoryBoard from "./WhStoryBoard"
import {AreaInfo, ContainerInfo, StationInfo} from '../sdk/Data';

import {GetRequest, initAreaByNoApi, initContainersByAreaApi, initPlatformsApi} from './api'
import SocketService from "./SocketService";
import {DefaultStorage} from "../sdk/Storage";
import {Station} from "../sdk/models/Station";

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

    setInterval(() => {
        // TODO 更新每个area的托盘变动，或启动websocket监听托盘变动
        // 连接 WebSocket service

    }, 1000)

    const url = genWsUrl()
    let ws = SocketService.Instance
    ws.url = url

    ws.onmessage = (msg) => {
        // console.log(msg)
        if (msg == undefined || msg.data == undefined) {
            return
        }
        // console.log(msg)
        let d = JSON.parse(msg.data)
        // console.log(d)

        //
        dynamicDisplayInventory(sb, d)
    }

    ws.connect()


    // setInterval(() => {
    //     // TODO 更新每个站台状态变动
    // }, 1000)

    // await test(sb)
}

class DataModel {
    dataType: string // 数据类型
    payload: any // 数据内容

}

const a: Map<string, any> = new Map() // 站台

a["station"] = (payload: any) => {

}
a["container_in"] = (payload: any) =>{

}


class DynamicDisplayWSData {
    // 站台
    stationNo: string
    currNum: number
    totalNum: number
    stationType: number

// 托盘
    containerNo: string
    // 入库托盘参数
    posX: number
    posY: number
    posZ: number
}

// 动态删除托盘
const dynamicDisplayInventory = async (sb: WhStoryBoard, data: DynamicDisplayWSData): Promise<void> => {
    console.log("==========>", data)
    // 1 出库
    // 2 入库
    const {stationNo, stationType, currNum, totalNum, containerNo, posX, posY, posZ} = data


    let station = DefaultStorage.stationMesh.get(stationNo);
    let rate = Math.floor(currNum / totalNum * 100)

    if (stationType == 1) {
        station!.statusWork(`装车中... %${rate}`)

        console.log(containerNo)
        // 删除托盘
        sb.removeContainer(containerNo)

        if (rate == 100) {
            station?.statusIdle()
        }
    } else {
        station!.statusWork(`卸货中... %${rate}`)

        let c = new ContainerInfo(containerNo, "PX01").Pos(posX, posY, posZ)
        c.Build()
        sb.loadContainer(c)
        // 添加托盘
    }


    // let arr = [
    //     "Z-0511F",
    //     "Z-0511E",
    //     "Z-0511D",
    //     "Z-0511C",
    //     "Z-0511B",
    //     "Z-0511A",
    //     "No.7[IN]",
    //     "No.2[IN]",
    // ]
    //
    // let containers =  [
    //         "030100041942",
    //         "030100014441",
    //         "030100041198",
    //         "030100041201",
    //         "030100041204",
    //         "030100041212",
    //         "030100041214",
    //         "030100041215",
    //         "030100041207",
    //         "030100041209",
    //         "030100041229",
    //         "030100041222",
    //         "030100041226",
    //         "030100041234",
    //         "030100041238",
    //         "030100041245",
    //         "030100041247",
    //         "030100041240",
    //         "030100041244",
    //         "030100041200",
    //         "030100041211",
    //         "030100041217",
    //         "030100041230",
    //         "030100041231",
    //         "030100041224",
    //         "030100041227",
    //         "030100041248",
    //         "030100041242",
    //         "030100041249",
    //         "030100041250"
    //     ]
    //
    //
    // var no = DefaultStorage.stationMesh.get("Z-0511F");
    //
    // let crr = 1;
    // let total = 30;
    // setInterval(() => {
    //     let rate = Math.floor(crr / total * 100)
    //     no!.statusWork(`装车中... %${rate}`)
    //     // 删除托盘
    //     sb.removeContainer(containers[crr - 1])
    //     crr++
    //     if (crr > total) {
    //         no!.statusIdle()
    //         return
    //     }
    // }, 1000)
}

// function randomNum(max, min) {
//     const num = Math.floor(Math.random() * (max - min + 1)) + min
//     return num
// }


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
