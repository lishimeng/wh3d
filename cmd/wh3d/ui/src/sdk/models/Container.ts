import {BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import {CubeImpl} from "../Cube";
import {DefaultMaterials} from "../Materials";
import {Resources} from "../Resources";

const interWidth: number = 3.8 // 托盘大小
const outerWidth: number = 4 // 包裹托盘容器大小
const geo: BoxGeometry = new BoxGeometry(interWidth, interWidth, interWidth)
const outerGeo: BoxGeometry = new BoxGeometry(outerWidth, outerWidth, outerWidth)

export class Container extends CubeImpl {

    m: Mesh

    constructor() {
        let group = new Group()

        // let mat = DefaultMaterials.get(Resources.Goods)
        // let mesh = new Mesh(geo, mat)
        // mesh.layers.set(Layers.Goods)
        //
        //
        // super(mesh)
        //
        // this.m = mesh


        let mat = DefaultMaterials.get(Resources.Goods)
        let mesh = new Mesh(geo, mat)

        // let outerMat = DefaultMaterials.get(Resources.Goods)
        // let outerMat = new MeshBasicMaterial({transparent: true, opacity: 0.4})
        let outerMat = DefaultMaterials.get(Resources.Area)

        let outerMesh = new Mesh(outerGeo, outerMat)

        group.add(mesh)
        group.add(outerMesh)

        super(group)
        this.m = mesh

    }

    setMaterial(m: Resources) {

        let mat = DefaultMaterials.get(m)
        // let mat = new MeshStandardMaterial({color: new Color(0xDC143C)})

        if (mat == undefined) {
            return
        }

        this.m.material = mat!
    }


    setPosition(pos: Vector3) {
        this.mesh.position.set(pos.x, pos.y, pos.z)
    }
}
