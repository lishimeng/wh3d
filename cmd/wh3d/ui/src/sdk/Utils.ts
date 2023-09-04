import { Vector3 } from "three"
import Config from "./Config"
import { DefaultTiles } from "./Tiles"

/**
 * 获取绝对位置
 * @param zeroIndex 左上角顶点， x: 横向index y：纵向index 每个单位引用 Config#UnitLength
 * @param size 尺寸
 */

const TransPos = (zeroIndex: Vector3, size: Vector3) => {

    let unit = Config.Global.UnitLegth
    let x = (zeroIndex.x + size.x / 2) * unit
    let y = (zeroIndex.y + size.y / 2) * unit
    let z = (zeroIndex.z + size.z / 2) * unit
    let zero = DefaultTiles.getZeroPosition()
    return new Vector3(x + zero.x, y + zero.y, z + zero.z)
}

const TransZeroPos = (p: Vector3) => {
    return p.add(Config.Global.Offset)
}

const CalcSize = (size: Vector3) => {
    let unit = Config.Global.UnitLegth
    return new Vector3(size.x * unit, size.y * unit, size.z * unit)
}

export const Util = {
    transPos: TransPos,
    calcSize: CalcSize
}
