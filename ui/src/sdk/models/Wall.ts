import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from "three";
import Config from "../Config";
import { CubeImpl } from "../Cube";
import { Layers } from "../Layers";

const binWidth: number = Config.Global.UnitLegth
const binHeight: number = 1.0
const binDepth: number = 12.0
const mat = [
    new MeshPhongMaterial({color: 0xafc0ca}),  //前  0xafc0ca :灰色
    new MeshPhongMaterial({color: 0x9cb2d1}),  //后  0x9cb2d1：淡紫
    new MeshPhongMaterial({color: 0xd6e4ec}),  //上  0xd6e4ec： 偏白色
    new MeshPhongMaterial({color: 0xd6e4ec}),  //下
    new MeshPhongMaterial({color: 0xafc0ca}),  //左   0xafc0ca :灰色
    new MeshPhongMaterial({color: 0xafc0ca})  //右
]

export class Wall extends CubeImpl {

    constructor(size: Vector3) {
        let geo: BoxGeometry = new BoxGeometry(size.x, size.y, size.z)
        let mesh: Mesh = new Mesh(geo, mat)
        mesh.layers.set(Layers.Environment)
        super(mesh)
    }
}