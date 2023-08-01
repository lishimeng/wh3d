import {Scene, Vector2, Vector3} from "three"
import {Area} from "../sdk/models/Area"
import {Bin} from "../sdk/models/Bin"
import {Container} from "../sdk/models/Container"
import {Ground} from "../sdk/models/Ground"
import {Resources} from "../sdk/Resources"
import {DefaultLoader} from "../sdk/Loader"
import {Util} from "../sdk/Utils"
import {DefaultStorage} from "../sdk/Storage"
import {AreaInfo, ContainerInfo, StationInfo} from "../sdk/Data"
import {Wall} from "../sdk/models/Wall"
import {Station} from "../sdk/models/Station"
import StoryBoard from "../sdk/StoryBoard"

// import * as FloorConfig from './a511_floor.json'
import {initfloorconfApi,GetRequest} from './api'


export default class WhStoryBoard extends StoryBoard {

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

        let param = GetRequest();

        const {items: items, code: code} = await initfloorconfApi({
            whNo: param.wh
        })
        console.log(items, code)
        if (code != 200) {
            return
        }

        // let floorW = 0,
        //     floorH = 0;
        this.floorH = items[0].height
        this.floorW = items[0].width

        let s = Util.calcSize(new Vector3(this.floorW, 1, this.floorH))
        let floorFrom = Util.calcSize
        let p = Util.transPos(new Vector3(0, 0, 0), new Vector3(this.floorW, 0, this.floorH))
        let ground = new Ground(p, new Vector2(s.x, s.z))
        this.add(ground.mesh)
    }

    loadSky(): void {
        // let sky = new Sky()
        // this.add(sky.mesh)
        let bg = DefaultLoader.getTexture(Resources.SkyScene)
        this.scene.background = bg
    }

    loadWalls() {
        console.log('开始加载墙面:4个面', this.floorW, this.floorH)

        // let width = Config.Global.TilesW
        let width = this.floorW
        // let height = 60
        let height = this.floorH
        this.loadWall(
            new Vector3(-1, 0, -1),
            new Vector3(width + 1, 1, 1)) // 上
        this.loadWall(
            new Vector3(-1, 0, height),
            new Vector3(width + 1, 1, 1)) // 下

        this.loadWall(
            new Vector3(-1, 0, 0),
            new Vector3(1, 1, height)) // 左

        this.loadWall(
            new Vector3(width - 1, 0, 0),
            new Vector3(1, 1, height)) // 右
    }

    loadWall(pos: Vector3, size: Vector3) {

        let p = Util.transPos(pos, size)
        let s = Util.calcSize(size)

        let wall = new Wall(s)
        let mesh = wall.mesh

        mesh.position.set(p.x, p.y, p.z)

        this.add(mesh)
    }

    loadBin(): void {
        let binWidth = 18

        // for (let i = 0; i < 3; i++) {
        //     let b = new Bin()
        //     b.mesh.position.set(0, 0, i)
        //     this.add(b.mesh)
        // }
        let b = new Bin()
        b.mesh.position.set(10, 0, 10)
        this.add(b.mesh)
    }

    async loadAreas(areas: AreaInfo[]): Promise<void> {

        for (let i = 0; i < areas.length; i++) {
            let area = areas[i]
            area.Build()
            // 存储
            DefaultStorage.areaLocMap.set(area.name, area)
            this.loadArea(area.name, area.pos, area.size)
        }

    }

    loadArea(name: string, pos: Vector3, size: Vector3) {

        let b = new Area(name, size.x, size.z)
        b.mesh.position.set(pos.x, 1, pos.z)
        this.add(b.mesh)

        DefaultStorage.areaMesh.set(name, b)
    }

    async loadContainers(containers: ContainerInfo[]): Promise<void> {

        for (let i = 0; i < containers.length; i++) {
            let c: ContainerInfo = containers[i]
            let areaInfo = DefaultStorage.areaLocMap.get(c.areaName)
            if (areaInfo == null || areaInfo == undefined) {
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
                container.setMaterial(Resources.Goods0)
                break
            case 1: // 二层
                container.setMaterial(Resources.Goods1)
                break
            case 2: // 三层
                container.setMaterial(Resources.Goods2)
                break
        }
        let mesh = container.mesh

        mesh.position.set(c.pos.x, c.pos.y, c.pos.z)
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

    // async loadBins(stations: Bin[]) {
    //
    //     for (let i = 0; i < stations.length; i++) {
    //         let station = stations[i]
    //         station.Build()
    //         // 存储
    //         DefaultStorage.stationMap.set(station.name, station)
    //         this.loadBin(station)
    //     }
    // }

    // loadBin(s: Bin) {
    //     let b = new Bin(s.name, s.size.x, s.size.z, s.face)
    //     b.mesh.position.set(s.pos.x, 1, s.pos.z)
    //     this.add(b.mesh)
    //
    //     DefaultStorage.stationMesh.set(s.name, b)
    // }

    loadOthers() {
    }

    removeContainer(name: string) {
        let c = DefaultStorage.containerMesh.get(name)
        if (c != null) {
            DefaultStorage.containerMesh.delete(name)
            this.remove(c.mesh)
        }
    }
}
