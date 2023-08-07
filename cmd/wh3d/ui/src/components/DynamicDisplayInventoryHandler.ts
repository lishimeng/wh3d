import WhStoryBoard from "./WhStoryBoard";
import {DefaultStorage} from "../sdk/Storage";
import {ContainerInfo} from "../sdk/Data";


// 入库json类型数据定义
interface containerOutData {
    // 站台
    stationNo: string
    currNum: number
    totalNum: number
    // 托盘
    containerNo: string
}

// 入库json类型数据定义
interface containerInData {
    // 站台
    stationNo: string
    currNum: number
    totalNum: number
    // 托盘
    containerNo: string
    // 入库托盘坐标
    posX: number
    posY: number
    posZ: number
}

// 事件类型
export enum EventType {
    CONTAINER_OUT = "10", // 托盘出库
    CONTAINER_IN = "20" // 托盘入库
}

// 接受ws返回数据格式类型
export class EventData {
    eventType!: "10" | "20" // 事件类型
    payload!: string // 数据json
}


// 事件类型处理类
export class DynamicDisplayInventoryHandler {
    // 定义事件处理类型器
    private containerEventHandler = new Map<string, (data: string, sb: WhStoryBoard) => {}>()

    constructor() {
        // 初始化事件类型处理机制
        // @ts-ignore
        this.containerEventHandler.set(EventType.CONTAINER_OUT, (data: string, sb: WhStoryBoard) => {
            // console.log(EventType.CONTAINER_OUT)
            let json: containerOutData = JSON.parse(data)
            // console.log(json)

            let station = DefaultStorage.stationMesh.get(json.stationNo);
            let rate = Math.floor(json.currNum / json.totalNum * 100)
            station!.statusWork(`装车中... %${rate}`)

            // 删除托盘
            sb.removeContainer(json.containerNo)

            if (rate >= 100) {
                station?.statusIdle()
            }
        })

        // @ts-ignore
        this.containerEventHandler.set(EventType.CONTAINER_IN, (data: string, sb: WhStoryBoard) => {
            // console.log(EventType.CONTAINER_IN)
            let json: containerInData = JSON.parse(data)
            // console.log(json)

            let station = DefaultStorage.stationMesh.get(json.stationNo);
            let rate = Math.floor(json.currNum / json.totalNum * 100)

            station!.statusWork(`卸货中... %${rate}`)

            let c = new ContainerInfo(json.containerNo, "PX01").Pos(json.posX, json.posY, json.posZ)
            c.Build()
            sb.loadContainer(c)

            if (rate >= 100) {
                station?.statusIdle()
            }
        })
    }

    // 处理函数
    async Handle(eventData: EventData, sb: WhStoryBoard): Promise<void> {
        console.log("containerEventHandlert", this.containerEventHandler)
        let handler = this.containerEventHandler.get(eventData.eventType + "");
        console.log("handler", handler)
        if (handler) {
            handler(eventData.payload, sb)
        }
    }
}