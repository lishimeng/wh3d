import { BoxGeometry, Mesh } from "three";
import { CubeImpl } from "../Cube";
import { Layers } from "../Layers";
import { DefaultMaterials } from "../Materials";
import { Resources } from "../Resources";

export class Road extends CubeImpl {

    constructor(width: number, height: number) {
        let mat = DefaultMaterials.get(Resources.Area)
        let geo = new BoxGeometry(width, 0.1, height)
        let mesh: Mesh = new Mesh(geo, mat)
        mesh.layers.set(Layers.Facility)
        super(mesh)
    }
}