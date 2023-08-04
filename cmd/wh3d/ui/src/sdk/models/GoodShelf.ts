/**
 * @Author: Connor
 * @Date:   23.8.2 17:17
 * @Description:
 */
import {CubeImpl} from "../Cube";
import {BoxGeometry, Color, Group, Mesh, MeshStandardMaterial, Sprite, SpriteMaterial, Texture} from "three";
import {Layers} from "../Layers";
import {DefaultMaterials} from "../Materials";
import {Resources} from "../Resources";

const idleColor = '#0000ff'
const workColor = '#00ff00'

export class GoodShelf extends CubeImpl {
    name: string

    label!: Sprite


    constructor(name: string, width: number, height: number) {
        let group = new Group()

        super(group);
        this.name = name

        //创建外边框
        let outMat = DefaultMaterials.get(Resources.Area)
        let outGeo = new BoxGeometry(width, 0.1, height)
        let outMesh = new Mesh(outGeo, outMat)
        group.add(outMesh)

        // 创建正方体
        let geo = new BoxGeometry(width, 0.1, height)
        // let mat = new MeshStandardMaterial({color: new Color(0xDC143C)})
        let mat = DefaultMaterials.get(Resources.Area)
        let mesh: Mesh = new Mesh(geo, mat)
        group.add(mesh)

        // 展示标题文字

        this.label = this.createLabel()
        this.changeMaterial(this.createLabelMaterial(this.name, idleColor))
        // this.label.scale.set(0.5 * 50, 0.25 * 50, 0.20 * 50)
        this.label.scale.set(0.5 * 100, 0.25 * 100, 0.20 * 100)
        this.label.position.set(0, 20, 0)
        group.add(this.label)

        group.layers.set(Layers.Facility)
        mesh.layers.set(Layers.Facility)
    }

    createLabel(): Sprite {
        var s = new Sprite()
        return s
    }

    changeMaterial(mat: SpriteMaterial) {
        let tmp = this.label.material
        this.label.material = mat
        if (tmp != null) {
            tmp.dispose()
        }
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
}
