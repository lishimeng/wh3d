import {BoxGeometry, BoxHelper, Color, Group, Mesh, MeshStandardMaterial, Sprite, SpriteMaterial, Texture} from "three";
import {CubeImpl} from "../Cube";
import {Layers} from "../Layers";

const idleColor = '#0000ff'
const workColor = '#00ff00'

export class Area extends CubeImpl {

    label!: Sprite

    name: string

    constructor(name: string, font: string, width: number, height: number) {
        let group = new Group()
        super(group)
        this.name = name
        // let mat = DefaultMaterials.get(Resources.Area)

        let geo = new BoxGeometry(width, 0.1, height)
        let mat = new MeshStandardMaterial({color: new Color(0x234d75), transparent: true, opacity: 0.5})
        let mesh: Mesh = new Mesh(geo, mat)

        const line = new BoxHelper(mesh, 0xffffff);
        line.layers.set(Layers.Facility)

        group.add(line)
        group.add(mesh)

        this.label = this.createLabel(name, idleColor, font)
        this.label.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100)
        this.label.position.set(0, 25, 0)

        group.add(this.label)

        group.layers.set(Layers.Facility)
        mesh.layers.set(Layers.Facility)
        this.label.layers.set(Layers.Facility)
    }

    createLabel(content: string, color: string, font: string): Sprite {

        var material = this.createLabelMaterial(content, color, font)
        var s = new Sprite(material)
        return s
    }

    createLabelMaterial(content: string, color: string, font = "45px Microsoft YaHei"): SpriteMaterial {
        var canvas = document.createElement("canvas")
        var ctx = canvas.getContext("2d")

        var w = ctx!.canvas.width
        var h = ctx!.canvas.height
        ctx!.fillStyle = color
        // ctx!.font = "40px Microsoft YaHei"
        ctx!.font = font
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
        let tmp = this.label.material
        this.label.material = this.createLabelMaterial(this.name, idleColor)
        tmp.dispose()
    }

    statusWork(content: string) {
        let tmp = this.label.material
        this.label.material = this.createLabelMaterial(content, workColor)
        tmp.dispose()
    }

}
