import {
    BoxGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    Vector2,
    Vector3
} from "three"
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

// import * as FloorConfig from './a511_floor.json'
import {GetRequest, initfloorconfApi} from './api'
import {GoodShelf} from "../sdk/models/GoodShelf";
import {DefaultMaterials} from "../sdk/Materials";


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
        // group2.add(ground3.mesh)


        // this.add(ground.mesh)
        this.add(group2)
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

    async loadAreas(areas: AreaInfo[]): Promise<void> {

        for (let i = 0; i < areas.length; i++) {
            let area = areas[i]
            area.Build()
            // 存储
            DefaultStorage.areaLocMap.set(area.name, area)
            this.loadArea(area.name, area.pos, area.size)
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

    loadOthers() {
    }

    removeContainer(name: string) {
        let c = DefaultStorage.containerMesh.get(name)
        if (c != null) {
            DefaultStorage.containerMesh.delete(name)
            this.remove(c.mesh)
        }
    }

    async LoadShelves(zone: object) {

        let goodsshelf = DefaultMaterials.getModule(Resources.MoudleGoodsShelf)

        let rel = new Vector3(-100, 0, -80)
        goodsshelf.scale.set(16, 10, 10)
        goodsshelf.position.set(-65, 0, -77)
        goodsshelf.rotation.y = -Math.PI
        goodsshelf.receiveShadow = true
        goodsshelf.visible = true // 默认空闲

        let boxMat = new MeshLambertMaterial({color: 0x000000});
        let boxGeo = new BoxGeometry(5, 5, 5);
        let boxMesh = new Mesh(boxGeo, boxMat);
        boxMesh.position.set(0, 1, 0)

        this.add(goodsshelf)
        // this.add(boxMesh);

        // console.log('zone', zone);
        // let zShelves = zone.shelves;
        // // 预设货架支架的厚度
        // let thickness = 0.5;
        // // 货架组
        // let shelves = new Group();
        // // 材质
        // let material = new MeshLambertMaterial({color: 0x3366ff});
        // // 生成每一层
        // for (let i = 0; i <= zShelves.rowNum; i++) {
        //     let rowY = zShelves.y + thickness / 2 + zShelves.height * i;
        //     // 生成每一格
        //     for (let j = 0; j < zShelves.columnNum; j++) {
        //         // 添加隔板(厚度设为支架的一半)
        //         // let boardGeo = new BoxGeometry(zShelves.width, thickness/2, zShelves.depth);
        //         // let boardMesh = new Mesh(boardGeo, material);
        //         // 平板的起始位置
        //         // let boardStartZ = zShelves.z - zone.depth/2 + zShelves.depth/2 + 0.1;
        //         // let boardZ = boardStartZ + zShelves.depth*j;
        //         let boardStartX = zShelves.x - zone.width / 2 + zShelves.width / 2 + 0.1;
        //         let boardX = boardStartX + zShelves.width * j;
        //         // boardMesh.position.set(zShelves.x, rowY, boardZ);
        //         // shelves.add(boardMesh);
        //         let trestleGeo = new BoxGeometry(thickness, zShelves.height, thickness);
        //         // 根据隔板位置定位
        //         let trestleY = rowY + zShelves.height / 2;
        //         // 水平支架
        //         let trestleGeoV = new BoxGeometry(zShelves.width, thickness, thickness);
        //         // 上v
        //         let mesh = new Mesh(trestleGeoV, material);
        //
        //         // mesh.position.set(zShelves.x - zShelves.width/2 + thickness - thickness/2, rowY, boardZ);
        //         mesh.position.set(boardX, rowY, zShelves.z - zShelves.depth / 2 + thickness / 2);
        //         shelves.add(mesh);
        //         // 下v
        //         mesh = new Mesh(trestleGeoV, material);
        //         // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, rowY, boardZ);
        //         mesh.position.set(boardX, rowY, zShelves.z + zShelves.depth / 2 - thickness / 2);
        //         shelves.add(mesh);
        //         // 中x1
        //         let trestleGeoH = new BoxGeometry(thickness, thickness, zShelves.depth);
        //         mesh = new Mesh(trestleGeoH, material);
        //         // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/4 + thickness/2);
        //         mesh.position.set(boardX - zShelves.width / 4 + thickness / 2, rowY, zShelves.z);
        //         shelves.add(mesh);
        //         // 中x2
        //         mesh = new Mesh(trestleGeoH, material);
        //         // mesh.position.set(zShelves.x, rowY, boardZ + thickness/2);
        //         mesh.position.set(boardX + thickness / 2, rowY, zShelves.z);
        //         shelves.add(mesh);
        //         // 中x3
        //         mesh = new Mesh(trestleGeoH, material);
        //         // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/4 + thickness/2);
        //         mesh.position.set(boardX + zShelves.width / 4 + thickness / 2, rowY, zShelves.z);
        //         shelves.add(mesh);
        //         // 前x
        //         mesh = new Mesh(trestleGeoH, material);
        //         // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/2 - thickness/2);
        //         mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, rowY, zShelves.z);
        //         shelves.add(mesh);
        //         // 最后一层不用添加竖向支架
        //         if (i !== zShelves.rowNum) {
        //             // 添加第一格多出的2根支柱+水平支架
        //             if (j === 0) {
        //                 // 左v
        //                 let mesh = new Mesh(trestleGeo, material);
        //                 // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
        //                 mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, trestleY, zShelves.z - zShelves.depth / 2 + thickness / 2);
        //                 shelves.add(mesh);
        //                 // 右v
        //                 mesh = new Mesh(trestleGeo, material);
        //                 // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
        //                 mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, trestleY, zShelves.z + zShelves.depth / 2 - thickness / 2);
        //                 shelves.add(mesh);
        //                 // 前x
        //                 let trestleGeoH = new BoxGeometry(thickness, thickness, zShelves.depth);
        //                 mesh = new Mesh(trestleGeoH, material);
        //                 // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/2 + thickness/2);
        //                 mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, rowY, zShelves.z);
        //                 shelves.add(mesh);
        //             }
        //             // 添加箱子
        //             if (zShelves.container) {
        //                 let boxMat = new MeshLambertMaterial({color: 0xffcc99});
        //                 let boxGeo = new BoxGeometry(zShelves.container.width, zShelves.container.height, zShelves.container.depth);
        //                 let boxMesh = new Mesh(boxGeo, boxMat);
        //                 // boxMesh.position.set(zShelves.x + zShelves.width/2 - 0.8 - thickness/2, rowY + 0.45, boardZ + zShelves.depth/2 - thickness/2 - 1);
        //
        //                 // boxMesh.position.set(boardX + zShelves.width/2 - thickness/2 - 1, rowY+0.9, zShelves.z + zShelves.depth/2 - 0.8 - thickness/2);
        //
        //                 let x = zShelves.container.x;
        //                 let y = zShelves.container.y;
        //                 let z = zShelves.container.z;
        //                 boxMesh.position.set(x, y, z)
        //
        //                 shelves.add(boxMesh);
        //             }
        //             // 每格对应2根垂直支撑柱(0.1*0.1*1)
        //             let mesh = new Mesh(trestleGeo, material);
        //             // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
        //             mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, trestleY, zShelves.z + zShelves.depth / 2 - thickness / 2);
        //             shelves.add(mesh);
        //             mesh = new Mesh(trestleGeo, material);
        //             // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
        //             mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, trestleY, zShelves.z - zShelves.depth / 2 + thickness / 2);
        //             // mesh.receiveShadow = true;
        //             // mesh.castShadow = true;
        //             shelves.add(mesh);
        //         }
        //     }
        // }
        // // 标示牌的长宽高
        // // 平板的起始位置
        // // shelves.position.set(zShelves.x, zShelves.y, zShelves.z);
        // let boardStartX = zShelves.x - zone.width / 2 + zShelves.width / 2 + 0.1;
        // let flagGeo = new BoxGeometry(0.2, 8, 8);
        // let flatMat = new MeshBasicMaterial({color: 0xffffff});
        // // 左面的白板
        // let mesh = new Mesh(flagGeo, flatMat);
        // // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
        // mesh.position.set(boardStartX - zShelves.width / 2, zShelves.height, zShelves.z);
        // mesh.name = 'flagBoard';
        // shelves.add(mesh);
        // // 右面的白板
        // let boardX = boardStartX + zShelves.width * (zShelves.columnNum - 1);
        // mesh = new Mesh(flagGeo, flatMat);
        // // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
        // mesh.position.set(boardX + zShelves.width / 2, zShelves.height, zShelves.z);
        // mesh.name = 'flagBoard';
        // shelves.add(mesh);
        // shelves.name = zShelves.name;
        // this.add(shelves)
        // return shelves;
    }

}
