import {Group, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, Scene, Vector2, Vector3} from "three"
import {Area} from "../sdk/models/Area"
import {Bin} from "../sdk/models/Bin"
import {Container} from "../sdk/models/Container"
import {Ground} from "../sdk/models/Ground"
import {Resources} from "../sdk/Resources"
import {DefaultLoader} from "../sdk/Loader"
import {Util} from "../sdk/Utils"
import {DefaultStorage} from "../sdk/Storage"
import {AreaInfo, ContainerInfo, GoodsShelfInfo, StationInfo} from "../sdk/Data"
import {Wall} from "../sdk/models/Wall"
import {Station} from "../sdk/models/Station"
import StoryBoard from "../sdk/StoryBoard"
import { Layers } from "../sdk/Layers";
import {GetRequest, initfloorconfApi} from './api'
import {GoodShelf} from "../sdk/models/GoodShelf";

export default class WhStoryBoard extends StoryBoard {

    // 地板宽高
    private floorW: number
    private floorH: number

    constructor(scene: Scene) {
        super(scene)
        this.init()
    }

    async init(): Promise<void> {

        await this.loadFloor()
        await this.loadSky()

        await this.loadWalls()
        await this.loadOthers()
    }

    async loadFloor(): Promise<void> {

        let urlParams = GetRequest();

        const {items: items, code: code} = await initfloorconfApi({
            whNo: urlParams.get("id")
        })
        // console.log(items, code)
        if (code != 200) {
            return
        }
        let group2 = new Group()

        // 宽、高
        this.floorH = items[0].height
        this.floorW = items[0].width

        let s = Util.calcSize(new Vector3(this.floorW, 2, this.floorH))
        // let floorFrom = Util.calcSize

        let p = Util.transPos(new Vector3(0, 0, 0), new Vector3(this.floorW, 0, this.floorH))
        let ground = new Ground(p, new Vector2(s.x, s.z), undefined)
        group2.add(ground.mesh)

        let s2 = Util.calcSize(new Vector3(this.floorW, 4, this.floorH))

        let p2 = Util.transPos(new Vector3(0, 0, 0), new Vector3(this.floorW, 0, this.floorH))
        let ground3 = new Ground(p2, new Vector2(s2.x, s2.z), new MeshBasicMaterial({transparent: true, opacity: 0.5}))
        ground3.mesh.position.y = 20
        // ground3.mesh.layers.set(Layers.Environment)
        // group2.add(ground3.mesh)


        // this.add(ground.mesh)
        this.add(group2)
    }


    loadSky():  Promise<void> {
        // let sky = new Sky()
        // this.add(sky.mesh)
        let bg = DefaultLoader.getTexture(Resources.SkyScene)
        this.scene.background = bg
        // this.scene.layers.set(Layers.Environment)
    }

    loadWalls(): Promise<void> {
        console.log('开始加载墙面:4个面', this.floorW, this.floorH)

        // let width = Config.Global.TilesW
        let width = this.floorW
        // let height = 60
        let height = this.floorH

        let yHeight = 4 / 2

        this.loadWall(
            new Vector3(-1, 0, -1),
            new Vector3(width + 1, yHeight, 1)) // 上
        this.loadWall(
            new Vector3(-1, 0, height),
            new Vector3(width + 1, yHeight, 1)) // 下

        this.loadWall(
            new Vector3(-1, 0, 0),
            new Vector3(1, yHeight, height)) // 左

        this.loadWall(
            new Vector3(width - 1, 0, 0),
            new Vector3(1, yHeight, height)) // 右
    }

    loadWall(pos: Vector3, size: Vector3) {

        let p = Util.transPos(pos, size)
        let s = Util.calcSize(size)

        let wall = new Wall(s)
        let mesh = wall.mesh
        // let mat = new MeshStandardMaterial({color: new Color(0xDC143C)})


        mesh.position.set(p.x, p.y, p.z)

        this.add(mesh)
    }

    async loadBin(): Promise<void> {
        let binWidth = 18

        // for (let i = 0; i < 3; i++) {
        //     let b = new Bin()
        //     b.mesh.position.set(0, 0, i)
        //     this.add(b.mesh)
        // }
        let b = new Bin()
        b.mesh.position.set(0, 0, 0)
        this.add(b.mesh)
    }

    async loadAreas(areas: AreaInfo[], font = "45px Microsoft YaHei"): Promise<void> {

        for (let i = 0; i < areas.length; i++) {
            let area = areas[i]
            area.Build()
            // 存储
            DefaultStorage.areaLocMap.set(area.name, area)
            this.loadArea(area.name, font, area.pos, area.size)
        }
    }

    async loadRoads() {
        // 加载地面箭头
        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(-65, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(-65, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(-15, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(-15, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(35, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(35, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(85, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(85, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(135, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(135, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(185, 0, 20)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })

        DefaultLoader.loadTexture(Resources.Road, "./images/roll.png", (texture) => {

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            let floorMat = new MeshBasicMaterial({
                map: texture
            });

            const binLineGeo: PlaneGeometry = new PlaneGeometry(30, 5)
            let mesh = new Mesh(binLineGeo, floorMat)
            let rotation = Math.PI / 2
            mesh.position.set(185, 0, -15)
            mesh.rotation.set(-rotation, 0, -rotation * 2)
            this.add(mesh)
        })
    }

    loadArea(name: string, font: string, pos: Vector3, size: Vector3) {

        let b = new Area(name, font, size.x, size.z)
        b.mesh.position.set(pos.x, 1, pos.z)
        this.add(b.mesh)

        DefaultStorage.areaMesh.set(name, b)
    }

    async loadContainers(containers: ContainerInfo[]): Promise<void> {

        for (let i = 0; i < containers.length; i++) {
            let c: ContainerInfo = containers[i]
            let areaInfo = DefaultStorage.areaLocMap.get(c.areaName)
            if (areaInfo == null) {
                continue
            }

            c.AreaPos(areaInfo.tile)
            c.Build()
            DefaultStorage.containerLocMap.set(c.name, c)
            this.loadContainer(c)
        }
    }

    loadContainer(c: ContainerInfo) {
        let container = new Container()
        let p = c.tileRelative
        switch (p.y) {
            case 0: // 一层
                break
            case 1: // 二层
                // let mat1 = new MeshBasicMaterial({color: "green"})
                // let mat11 = new MeshBasicMaterial({color: "red"})
                // container.setMaterialForColor([mat11, mat1, mat11, mat1, mat1, mat1])
                break
            case 2: // 三层
                // container.setMaterial(Resources.Goods2)
                // let mat2 = new MeshBasicMaterial({color: "pink"})
                // let mat22 = new MeshBasicMaterial({color: "purple"})
                // container.setMaterialForColor([mat2, mat22, mat2, mat22, mat22, mat22])
                break
        }
        let mesh = container.mesh
        // c.pos.y - 3 设置 托盘紧挨着地板

        mesh.position.set(c.pos.x, c.pos.y - 3, c.pos.z)
        mesh.userData["c_name"] = c.name
        this.add(mesh)
        DefaultStorage.containers.push(mesh)
        DefaultStorage.containerMesh.set(c.name, container) // 保存container
    }

    async loadStations(stations: StationInfo[]) {

        for (let i = 0; i < stations.length; i++) {
            let station = stations[i]
            station.Build()
            // 存储
            DefaultStorage.stationMap.set(station.name, station)
            this.loadStation(station)
        }
    }

    loadStation(s: StationInfo) {
        let b = new Station(s.name, s.size.x, s.size.z, s.face)
        b.mesh.position.set(s.pos.x, 1, s.pos.z)
        this.add(b.mesh)

        DefaultStorage.stationMesh.set(s.name, b)
    }

    async loadGoodShelfs(goodShelfs: GoodsShelfInfo[]) {
        for (let i = 0; i < goodShelfs.length; i++) {
            let goodShelf = goodShelfs[i]
            goodShelf.Build()
            // 存储
            // DefaultStorage.stationMap.set(station.name, station)
            this.loadGoodShelf(goodShelf)
        }
    }

    loadGoodShelf(s: GoodsShelfInfo) {
        let b = new GoodShelf(s.name, s.size.x, s.size.z)
        b.mesh.position.set(s.pos.x, 1, s.pos.z)
        this.add(b.mesh)

        // DefaultStorage.stationMesh.set(s.name, b)
    }

    loadOthers(): Promise<void> {
    }

    removeContainer(name: string) {
        let c = DefaultStorage.containerMesh.get(name)
        if (c != null) {
            DefaultStorage.containerMesh.delete(name)
            this.remove(c.mesh)
        }
    }

}
