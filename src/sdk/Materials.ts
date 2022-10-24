import { Group, Material, MeshBasicMaterial, RepeatWrapping } from "three"
import { Resources } from "./Resources"
import { DefaultLoader } from "./Loader"

class Materials {

    map: Map<Resources, Material>

    modules: Map<Resources, Group>

    constructor() {
        this.map = new Map()
        this.modules = new Map()
    }

    get(r: Resources): Material | undefined {
        return this.map.get(r)
    }

    getModule(r: Resources): Group {
        let m = this.modules.get(r)
        let g = m?.clone(true)
        return g!
    }

    init(): void {

        console.log('加载字体')
        DefaultLoader.loadFont(Resources.TTFKenpixel, './fonts/FZYaoTi_Regular.json')


        console.log('加载地面')
        DefaultLoader.loadTexture(Resources.Floor, "./images/floor.jpg", (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(10, 10);
            var floorMat = new MeshBasicMaterial({
                map: texture
            });
            this.map.set(Resources.Floor, floorMat)
        })

        console.log('加载天空背景')
        let skyUrls = [
            "./images/skybox/px.jpg",
            "./images/skybox/nx.jpg",
            "./images/skybox/py.jpg",
            "./images/skybox/ny.jpg",
            "./images/skybox/pz.jpg",
            "./images/skybox/nz.jpg"
        ]
        DefaultLoader.loadCube(Resources.SkyScene, skyUrls)

        console.log('加载区域贴图')
        DefaultLoader.loadTexture(Resources.Area, "./images/plane.png", (texture) => {
            let mat = new MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 })
            mat.needsUpdate = true
            this.map.set(Resources.Area, mat)
        })

        console.log('加载货架贴图')
        DefaultLoader.loadTexture(Resources.Area, "./images/rack.png", (texture) => {
            let mat = new MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 })
            mat.needsUpdate = true
            this.map.set(Resources.Shift, mat)
        })

        console.log('加载货物贴图')
        // let goodsUrl = "./images/box.png"
        let goodsUrl = "./images/crate.gif"

        DefaultLoader.loadTexture(Resources.Goods, goodsUrl, (texture) => {
            let goodsMat = new MeshBasicMaterial({ map: texture })
            this.map.set(Resources.Goods, goodsMat)
        })


        console.log('加载卡车模型')
        let truckUrl = "./modules/truck/scene.gltf"

        DefaultLoader.loadGltf(Resources.ModuleTruck, truckUrl, (module) => {
            this.modules.set(Resources.ModuleTruck, module)
        })
    }
}

export const DefaultMaterials = new Materials()