import { Area } from "./models/Area"
import { Station } from "./models/Station"
import { AreaInfo, ContainerInfo, StationInfo } from "./Data"
import { Container } from "./models/Container"
import { Object3D } from "three"


/**
 * 存储
 */
export class Storage {

    // 坐标以瓦片编号标记

    areaLocMap: Map<string, AreaInfo> = new Map()// 区域的顶点坐标，2D
    containerLocMap: Map<string, ContainerInfo> = new Map()// 托盘的顶点坐标，3D
    stationMap: Map<string, StationInfo> = new Map()

    stationMesh: Map<string, Station> = new Map() // 站台
    areaMesh: Map<string, Area> = new Map() //区域
    containerMesh: Map<string, Container> = new Map()//  容器
    containers: Object3D[] = new Array()

    constructor() {
    }
}

export const DefaultStorage = new Storage()