import { Vector3 } from "three"
import { Util } from "./Utils"

abstract class Module {
    name: string = '' // 编号

    /**
     * 实际坐标 3D地图配置, 通过Build函数计算得出
     */
    pos: Vector3 = new Vector3()
    /**
     * 大小长宽高
     */
    size: Vector3 = new Vector3()

    // 瓦片地图配置, 由模型实现负责设置
    tile: Vector3 = new Vector3() // 瓦片图坐标
    tileSize: Vector3 = new Vector3() // 瓦片大小(占用瓦片个数)

    Build(): void {
        // 计算实际位置
        let pos = Util.transPos(this.tile, this.tileSize)
        this.pos.set(pos.x, pos.y, pos.z)

        // 计算大小
        let size = Util.calcSize(this.tileSize)
        this.size.set(size.x, size.y, size.z)
    }
}

class AreaInfo extends Module{

    constructor(name: string) {
        super()
        this.name = name
    }

    /**
     * 俯视视图下坐标， 左上为0点
     * @param x 
     * @param z 
     * @returns 
     */
    Pos(x: number, z: number): AreaInfo { 
        this.tile.set(x, 0, z)
        return this
    }
    Size(containers: number, bins: number): AreaInfo {
        this.tileSize.set(containers, 0, bins)
        return this
    }
}

/**
 * 货架上的货物
 */
class ContainerInfo extends Module {
    areaName: string = '' // area编号
    areaTile: Vector3 = new Vector3(0, 0, 0)// area的坐标
    tileRelative: Vector3 = new Vector3(0, 0, 0) // 相对area的坐标

    constructor(name: string, area: string) {
        super()
        this.name = name
        this.areaName = area
    }

    /**
     * 相对于Area的tile坐标
     * @param p
     * @returns 
     */
    Pos(x?: number, y?: number, z?: number): ContainerInfo { 
        this.tileRelative.set(x!, y!, z!)
        return this
    }

    /**
     * 所属区域的tile坐标
     * @param p 
     * @returns 
     */
    AreaPos(p: Vector3): ContainerInfo {
        this.areaTile.set(p.x, p.y, p.z)
        return this
    }

    Build(): void {
        // tilePos
        let x = this.areaTile.x + this.tileRelative.x
        let y = this.areaTile.y + this.tileRelative.y
        let z = this.areaTile.z + this.tileRelative.z
        this.tile.set(x, y, z)

        // 计算大小, 固定, 占用一个单位
        this.tileSize.set(1, 1, 1)

        super.Build()
    }
}

class StationInfo extends Module{

    face = new Vector3(0, 0, 0)

    constructor(name: string) {
        super()
        this.name = name
        this.tileSize = new Vector3(2, 1, 1)
    }

    /**
     * 俯视视图下坐标， 左上为0点
     * @param x 
     * @param z 
     * @returns 
     */
    Pos(x: number, z: number): StationInfo { 
        this.tile.set(x, 0, z)
        return this
    }
    /**
     * 朝向，按坐标轴旋转
     * @param x x*PI >0生效
     * @param y y*PI >0生效
     * @param z z*PI >0生效
     * @returns 
     */
    FaceTo(x: number, y: number, z: number): StationInfo {
        this.face.set(x, y, z)
        return this
    }

    Build(): void {
        super.Build()
    }
}

export { AreaInfo, ContainerInfo, StationInfo }