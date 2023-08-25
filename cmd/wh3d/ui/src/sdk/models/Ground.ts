import {BoxGeometry, Material, Mesh, Vector2, Vector3} from "three";
import {CubeImpl} from "../Cube";
import {DefaultMaterials} from "../Materials";
import {Resources} from "../Resources";

export class Ground extends CubeImpl {

    constructor(pos: Vector3, size: Vector2, mat: undefined | Material) {
        const geo = new BoxGeometry(size.x, size.y, 1);
        // let mat = DefaultMaterials.get(Resources.Floor)
        if (!mat) {
            mat = DefaultMaterials.get(Resources.Floor)
        }
        let mesh = new Mesh(geo, mat!)
        mesh.position.set(pos.x, pos.y, pos.z)
        super(mesh)
        this.init()
    }

    init(): void {
        this.mesh.position.y = -1
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.receiveShadow = true
    }
}
