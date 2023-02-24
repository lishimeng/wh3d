import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Mesh, MeshStandardMaterial } from "three";
import { CubeImpl } from "../Cube";
import { Layers } from "../Layers";
import { DefaultLoader } from '../Loader';
import { Resources } from '../Resources';

const mat = new MeshStandardMaterial( { color: 0xff0000, flatShading: true } );

const height = 0.1

export class Label extends CubeImpl {

    constructor(name: string, size: number) {
        let font = DefaultLoader.getFont(Resources.TTFKenpixel)
        
        let geo = new TextGeometry(name, {
            font: font,
            size: size,
            height: height
        })
        geo.computeBoundingBox()
        let mesh: Mesh = new Mesh(geo, mat)
        mesh.layers.set(Layers.Environment)
        super(mesh)
    }

    init(): void {
        
    }
}