import {BoxGeometry, Color, Group, Mesh, MeshStandardMaterial, Sprite, SpriteMaterial, Texture, Vector3} from "three";
import {CubeImpl} from "../Cube";
import {Layers} from "../Layers";
import {DefaultMaterials} from "../Materials";
import {Resources} from "../Resources";

const idleColor = '#ff00ff'
const workColor = '#00ff00'

export class Station extends CubeImpl {

    label: Sprite

    truck: Group

    name: string

    constructor(name: string, width: number, height: number, faceTo: Vector3) {

        let group = new Group()
        if (faceTo.x != 0) {
            group.rotation.x = faceTo.x * Math.PI
        }

        if (faceTo.y != 0) {
            group.rotation.y = faceTo.y * Math.PI
        }

        if (faceTo.z != 0) {
            group.rotation.z = faceTo.z * Math.PI
        }
        super(group)

        this.name = name

        let outMat = DefaultMaterials.get(Resources.Area)
        let outGeo = new BoxGeometry(width, 0.1, height)
        let outMesh = new Mesh(outGeo, outMat)
        group.add(outMesh)

        let mat = new MeshStandardMaterial({color: new Color(0x363636)})
        let geo = new BoxGeometry(width, 0.1, height)
        let mesh: Mesh = new Mesh(geo, mat)

        group.add(mesh)

        this.label = this.createLabel()
        this.changeMaterial(this.createLabelMaterial(this.name, idleColor))
        this.label.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100)
        this.label.position.set(0, width * 2, 0)

        group.add(this.label)

        this.truck = DefaultMaterials.getModule(Resources.ModuleTruck)
        this.truck.scale.set(100, 100, 100)
        this.truck.position.set(0, 1, 0)
        this.truck.rotation.y = -Math.PI / 2
        this.truck.receiveShadow = true
        this.truck.visible = false // 默认空闲
        group.add(this.truck)

        group.layers.set(Layers.Facility)
        mesh.layers.set(Layers.Facility)
        outMesh.layers.set(Layers.Facility)
        this.label.layers.set(Layers.Facility)

        this.truck.traverse((item) => {
            item.layers.set(Layers.Facility)
        })
    }

    createLabel(): Sprite {
        var s = new Sprite()
        return s
    }

    createLabelMaterial(content: string, color: string): SpriteMaterial {
        var canvas = document.createElement("canvas")
        var ctx = canvas.getContext("2d")

        var w = ctx!.canvas.width
        var h = ctx!.canvas.height
        ctx!.fillStyle = color
        ctx!.font = "40px Microsoft YaHei"
        ctx!.textAlign = "center"
        ctx!.lineWidth = 1
        ctx!.fillText(content, w / 2, h / 2)
        var texture = new Texture(canvas)
        texture.needsUpdate = true

        //使用Sprite显示文字
        var material = new SpriteMaterial({map: texture})
        return material
    }

    statusIdle() {
        let mat = this.createLabelMaterial(this.name, idleColor)
        this.changeMaterial(mat)
        this.truck.visible = false
    }

    statusWork(content: string) {
        let mat = this.createLabelMaterial(content, workColor)
        this.changeMaterial(mat)
        this.truck.visible = true
    }

    changeMaterial(mat: SpriteMaterial) {
        let tmp = this.label.material
        this.label.material = mat
        if (tmp != null) {
            tmp.dispose()
        }
    }
}
