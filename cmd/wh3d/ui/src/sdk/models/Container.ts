import {BoxGeometry, BoxHelper, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import {CubeImpl} from "../Cube";
import {DefaultMaterials} from "../Materials";
import {Resources} from "../Resources";
import {Layers} from "../Layers";

const interWidth: number = 3.4 // 托盘大小
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


        // let mat = DefaultMaterials.get(Resources.Goods)
        let mat = new MeshBasicMaterial({color: "#2e5bff"})
        let mat2 = new MeshBasicMaterial({color: "#3a3ae3"})
        // 前 后 上 下 左 右
        let mesh = new Mesh(geo, [mat2, mat, mat2, mat, mat, mat])

        mesh.layers.set(Layers.Goods)

        // let outerMat = DefaultMaterials.get(Resources.Goods)
        let outerMat = new MeshBasicMaterial({transparent: true, opacity: 0.4})

        // let outerMat = DefaultMaterials.get(Resources.Area)
        let outerMesh = new Mesh(outerGeo, outerMat)
        outerMesh.layers.set(Layers.Goods)

        // 框架线
        // var wireframeMaterial = new MeshBasicMaterial({color: '#000000', wireframe: true, transparent: false});
        // var wireframe = new Mesh(mesh.geometry, wireframeMaterial);
        // group.add(wireframe);

        // 轮廓线
        const box: any = new BoxHelper(mesh, '#000000');  //object 模型
        group.add(box);
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

    setMaterialForColor(arr: MeshBasicMaterial[]) {
        this.m.material = arr
    }

    setPosition(pos: Vector3) {
        this.mesh.position.set(pos.x, pos.y, pos.z)
    }
}
