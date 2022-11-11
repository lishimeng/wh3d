import { Scene, Vector2, Vector3 } from "three"
import { Area } from "../sdk/models/Area"
import { Bin } from "../sdk/models/Bin"
import { Container } from "../sdk/models/Container"
import { Ground } from "../sdk/models/Ground"
import { Resources } from "../sdk/Resources"
import { DefaultLoader } from "../sdk/Loader"
import Config from "../sdk/Config"
import { Util } from "../sdk/Utils"
import { DefaultStorage } from "../sdk/Storage"
import { AreaInfo, ContainerInfo, StationInfo } from "../sdk/Data"
import { Wall } from "../sdk/models/Wall"
import { Label } from "../sdk/models/Label"
import { Station } from "../sdk/models/Station"
import StoryBoard from "../sdk/StoryBoard"

import * as FloorConfig from './a511_floor.json'
import * as OtherConfig from './a511_other.json'


export default class WhStoryBoard extends StoryBoard {

    constructor(scene: Scene) {
        super(scene)
        this.init()
    }

    init(): void {

        this.loadFloor()
        this.loadSky()
        
        this.loadWalls()
        this.loadOthers()
    }

    loadFloor(): void {

        let s = Util.calcSize(new Vector3(FloorConfig.floorW, 1, FloorConfig.floorH))
        let p = Util.transPos(new Vector3(0, 0, 0), new Vector3(FloorConfig.floorW, 0, FloorConfig.floorH))
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
        console.log('开始加载墙面:4个面')

        let width = Config.Global.TilesW
        let height = 29
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

        for (let i = 0; i < 3; i++) {
            let b = new Bin()
            b.mesh.position.set(0,0, (i + 1) * binWidth + 10)
            this.add(b.mesh)
        }
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
          if (areaInfo == null || areaInfo == undefined) { continue }

          c.AreaPos(areaInfo.tile)
          c.Build()
          DefaultStorage.containerLocMap.set(c.name, c)
          this.loadContainer(c)
        }
    }

    loadContainer(c: ContainerInfo) {
        let container = new Container()
        let mesh = container.mesh

        mesh.position.set(c.pos.x, c.pos.y, c.pos.z)
        this.add(mesh)
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

    loadOthers() {
        let slogen = OtherConfig.slogen
        let lab = new Label(slogen, 6)
        let mesh = lab.mesh
        mesh.position.set(-40, 1, 30)
    
        mesh.rotation.x = -Math.PI / 2.0

        this.add(mesh)

        let logo = OtherConfig.logo
        let logoLabel = new Label(logo, 6)
        let logoMesh = logoLabel.mesh
        logoMesh.position.set(-10, 1, 10)
    
        logoMesh.rotation.x = -Math.PI / 2.0

        this.add(logoMesh)
    }

    removeContainer(name: string) {
        let c = DefaultStorage.containerMesh.get(name)
        if (c != null) {
            DefaultStorage.containerMesh.delete(name)
            this.remove(c.mesh)
        }
    }
}