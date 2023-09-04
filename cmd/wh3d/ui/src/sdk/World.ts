import {GUI} from "dat.gui"
import {
    AmbientLight,
    AxesHelper,
    CameraHelper,
    Color,
    GridHelper,
    HemisphereLightHelper,
    Mesh,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer
} from "three"

import {MapControls} from "three/examples/jsm/controls/OrbitControls"

import Stats from 'three/examples/jsm/libs/stats.module'
import Config from "./Config"

import {Cube, CubeImpl} from "./Cube"
import {DefaultLayerManager, Layers} from "./Layers"
import {DefaultEventManager} from "./Event"


export interface World {

    start(): void

    add(c: Cube): void

    createCube(m: Mesh): Cube
}

export class WorldImpl implements World {
    scene!: Scene
    camera!: PerspectiveCamera
    cameraHelper!: CameraHelper
    renderer!: WebGLRenderer

    control!: MapControls

    hemiHelper!: HemisphereLightHelper
    stats: Stats

    pointer: Vector2 = new Vector2()
    raycast: Raycaster = new Raycaster()

    posList = new Array<Vector3>()

    gridHelper!: GridHelper

    constructor() {
        this.stats = Stats()
        document.body.appendChild(this.stats.domElement)
    }

    init(): void {

        this.posList.push(
            new Vector3(0, 200, 0),
            new Vector3(100, 200, 0),
            new Vector3(0, 100, 100),
            new Vector3(-100, 200, 0),
            new Vector3(50, 25, 0),
            new Vector3(0, 100, -100)
        )

        this.initScene()
        this.initCamera()
        this.initRender()
        // content
        this.initLight()
        this.initControls()
        this.initGui()
        document.addEventListener('resize', this.onWindowResize, false)
        document.addEventListener('pointerdown', (event) => {
            this.onMouseClick(event)
        }, false)
        let i = 0;
        setInterval(() => {
            i = (i + 1) % this.posList.length
            if (Config.Camare.Control && !Config.Camare.Lock) {
                let p = this.posList[i]
                this.moveCamera(p)
            }
        }, 5000)
        this.raycast.layers.set(Layers.Goods)

    }

    onWindowResize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    onMouseClick(event: any): void {

        console.log(event.clientX + ":" + event.clientY)
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        DefaultEventManager.updtePointer(this.pointer.x, this.pointer.y)

        DefaultEventManager.update(this.scene, this.camera)
    }

    initScene() {
        this.scene = new Scene()
        this.scene.background = new Color(0x000000)
        // this.scene.fog = new Fog( this.scene.background, 1000, 4000 )
        let axes = new AxesHelper(1000)
        this.scene.layers.set(Layers.Helper)

        axes.layers.set(Layers.Helper)
        this.scene.add(axes)

        let s = Config.Global.TilesW + 16
        let size = s * Config.Global.UnitLegth
        let tiles = s

        this.gridHelper = new GridHelper(
            size,
            tiles
        )
        this.gridHelper.layers.set(Layers.Helper)
        this.scene.add(this.gridHelper)

        DefaultLayerManager.scene = this.scene

    }

    initLight() {
        var ambient = new AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源
        ambient.layers.set(Layers.Light)
        this.scene.add(ambient)
    }

    initCamera(): void {
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            Config.Camare.Far
        )

        // this.camera.layers.set(Layers.Environment)
        this.scene.add(this.camera)
        this.moveCamera(new Vector3(0, 200, 0))
        this.camera.lookAt(0, 0, 0)
        DefaultLayerManager.camera = this.camera
    }

    moveCamera(pos: Vector3): void {
        this.camera.position.copy(pos)
        this.camera.updateMatrixWorld()
    }

    initRender(): void {
        this.renderer = new WebGLRenderer({antialias: true})
        this.renderer.setClearColor(new Color(0xeeeeee))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement);
    }

    initControls(): void {

        this.control = new MapControls(this.camera, this.renderer.domElement)

        this.control.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.control.dampingFactor = 0.05;

        this.control.screenSpacePanning = false;

        this.control.minDistance = 100;
        this.control.maxDistance = 500;

        this.control.maxPolarAngle = Math.PI / 2;
    }

    initGui(): void {

        let gui = new GUI()

        let cf = gui.addFolder('Camera')

        cf.add(Config.Camare, 'Control')
        cf.add(Config.Camare, 'Lock').onChange(() => {
            if (Config.Camare.Lock) {
                this.moveCamera(new Vector3(0, 200, 0))
            }
        })

        cf.open()

        let layer = gui.addFolder('Layer')
        layer.add(Config.Layer, 'Environment')
        layer.add(Config.Layer, 'Light')
        layer.add(Config.Layer, 'Facility')
        layer.add(Config.Layer, 'Goods')
        layer.add(Config.Layer, 'Helper')
        layer.close()

    }

    createCube(m: Mesh): Cube {
        return new CubeImpl(m)
    }

    add(c: Cube): void {
        this.scene.add(c.mesh)
    }

    animate(): void {
        requestAnimationFrame(() => {
            this.animate()
        })
        this.control?.update()

        DefaultLayerManager.update()

        this.stats.update()
        this.renderer?.render(this.scene, this.camera);

    }

    start(): void {
        this.init()
        this.animate()
    }
}

export default World
