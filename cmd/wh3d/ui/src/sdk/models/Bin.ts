import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";
import { CubeImpl } from "../Cube";
import { Layers } from "../Layers";

const binBorderWidth: number = 1.0
const containerWidth: number = 10.0
const containerCapacity: number = 5
const binWidth: number = containerWidth * containerCapacity

const binLineGeo: PlaneGeometry = new PlaneGeometry(binBorderWidth, binWidth)
const binHeadGeo: PlaneGeometry = new PlaneGeometry(binBorderWidth, containerWidth)
const binMat: MeshStandardMaterial = new MeshStandardMaterial({ color: 0xFFFFFF });

export class Bin extends CubeImpl {

    g: Group

    left: Mesh
    right: Mesh
    head: Mesh
    back: Mesh

    constructor() { // size：槽位数
        let g = new Group()
        super(g)

        let rotation = Math.PI / 2

        this.g = g
        this.head = new Mesh(binHeadGeo, binMat)
        this.head.position.set(0, 0, 0)
        this.head.rotation.set(-rotation, 0, rotation) //旋转成竖直
        this.g.add(this.head)

        this.back = new Mesh(binHeadGeo, binMat)
        this.back.position.set(0, 0, 49)
        this.back.rotation.set(-rotation, 0, rotation) //旋转成竖直
        this.g.add(this.back)

        let lineMoveX = containerWidth / 2 - binBorderWidth / 2
        let lineMoveZ = binWidth / 2 - binBorderWidth / 2
        this.left = new Mesh(binLineGeo, binMat)
        this.left.position.set(0 - lineMoveX , 0, lineMoveZ)
        this.left.rotation.set(-rotation, 0, 0) //旋转成水平
        this.g.add(this.left)

        this.right = new Mesh(binLineGeo, binMat)
        this.right.position.set(lineMoveX, 0, lineMoveZ)
        this.right.rotation.set(-rotation, 0, 0) //旋转成水平
        this.g.add(this.right)

        this.g.rotation.y = rotation

        this.g.layers.set(Layers.Facility)
        this.head.layers.set(Layers.Facility)
        this.left.layers.set(Layers.Facility)
        this.right.layers.set(Layers.Facility)
        this.back.layers.set(Layers.Facility)
    }

    init(): void {

    }
}
