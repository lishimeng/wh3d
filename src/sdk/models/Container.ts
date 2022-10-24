import { BoxGeometry, Mesh, Vector3 } from "three";
import Config from "../Config";
import { CubeImpl } from "../Cube";
import { Layers } from "../Layers";
import { DefaultMaterials } from "../Materials";
import { Resources } from "../Resources";

const width: number = Config.Global.Container.Width
const geo: BoxGeometry = new BoxGeometry(width, width, width)

export class Container extends CubeImpl {

    constructor() {
        let mat = DefaultMaterials.get(Resources.Goods)
        let mesh: Mesh = new Mesh(geo, mat)
        mesh.layers.set(Layers.Goods)
       
        super(mesh)
    }


    setPosition(pos: Vector3) {
        this.mesh.position.set(pos.x, pos.y, pos.z)
    }
}