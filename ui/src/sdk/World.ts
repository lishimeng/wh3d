import { GUI } from "dat.gui"
import { Scene, PerspectiveCamera, Mesh, AmbientLight, AxesHelper, WebGLRenderer, Color, HemisphereLight, HemisphereLightHelper, GridHelper, CameraHelper, Vector3 } from "three"

import { MapControls, OrbitControls } from "three/examples/jsm/controls/OrbitControls" 

import Stats from 'three/examples/jsm/libs/stats.module'
import Config from "./Config"

import { Cube, CubeImpl } from "./Cube"
import { Layers } from "./Layers"


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
    orbitControl!: OrbitControls

    mapControl!: MapControls

    hemiHelper!: HemisphereLightHelper
    stats: Stats

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
        let i = 0;
        setInterval(() => {
            i = (i + 1) % this.posList.length
            if (Config.Camare.Control && !Config.Camare.Lock) {
                let p = this.posList[i]
                this.moveCamera(p)
            }
        }, 5000)
    }

    onWindowResize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    initScene() {
        this.scene = new Scene()
        this.scene.background = new Color(0x000000)
        // this.scene.fog = new Fog( this.scene.background, 1000, 4000 )
        let axes = new AxesHelper(800)
        axes.layers.set(Layers.Helper)
        this.scene.add(axes)

        let size = Config.Global.TilesW * Config.Global.UnitLegth
        let tiles = Config.Global.TilesW

        this.gridHelper = new GridHelper(
            size, 
            tiles
        )
        this.gridHelper.layers.set(Layers.Helper)
        this.scene.add(this.gridHelper)
        
    }

    initLight() {
        var ambient = new AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源 
        ambient.layers.set(Layers.Light)       
        this.scene.add(ambient)

        const hemiLight = new HemisphereLight( 0xeeeeee, 0x080820 )
        hemiLight.position.set( 0, 20000, 0 )
        hemiLight.layers.set(Layers.Light)
        
        this.hemiHelper = new HemisphereLightHelper(hemiLight, 20)
        this.hemiHelper.color = new Color(0xffffff)
        this.hemiHelper.layers.set(Layers.Helper)
        this.scene.add( this.hemiHelper )
    }

    initCamera(): void {
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            Config.Camare.Far
        )

        this.cameraHelper = new CameraHelper(this.camera)
        this.cameraHelper.layers.set(Layers.Helper)
        this.scene.add(this.cameraHelper)
        this.moveCamera(new Vector3(0, 200, 0))
        this.camera.lookAt(0, 0, 0)
    }

    moveCamera(pos: Vector3): void {
        this.camera.position.copy(pos)
        this.camera.updateMatrixWorld()
    }

    initRender(): void {
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setClearColor(new Color(0xeeeeee))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement);
    }

    initControls(): void {
        this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        //this.orbitControl.enableDamping = true;
        //this.orbitControl.dampingFactor = 0.5;
        // 视角最小距离
        this.orbitControl.minDistance = 10;
        // 视角最远距离
        this.orbitControl.maxDistance = 50000;
        // 最大角度
        this.orbitControl.maxPolarAngle = Math.PI / 2.2;

        this.orbitControl.autoRotate = true

        this.orbitControl.target = new Vector3(0, 0, 0)


        // this.mapControl = new MapControls(this.camera, this.renderer.domElement)

        // // this.mapControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        // this.mapControl.dampingFactor = 0.05;

        // this.mapControl.screenSpacePanning = false;

        // this.mapControl.minDistance = 100;
        // this.mapControl.maxDistance = 500;

        // this.mapControl.maxPolarAngle = Math.PI / 2;
    }

    initGui():void {

        let gui = new GUI()

        let cf = gui.addFolder('Camera')
        
        cf.add(Config.Camare, 'Control')
        cf.add(Config.Camare, 'Lock').onChange(() => {
            if (Config.Camare.Lock) {
                this.moveCamera(new Vector3(0, 200, 0))
            }
        })
        // cf.add(() => {
        //     Config.Camare.NormalPos.copy(new Vector3(0, 200, 0))
        //     this.moveCamera()
        // }, "reset")
        
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
        if (Config.Camare.Control) {
            this.orbitControl?.update()
        }
        // this.mapControl?.update()

        if (Config.Layer.Environment) {
            this.camera.layers.enable(Layers.Environment)
        } else {
            this.camera.layers.disable(Layers.Environment)
        }

        if (Config.Layer.Facility) {
            this.camera.layers.enable(Layers.Facility)
        } else {
            this.camera.layers.disable(Layers.Facility)
        }

        if (Config.Layer.Light) {
            this.camera.layers.enable(Layers.Light)
        } else {
            this.camera.layers.disable(Layers.Light)
        }

        if (Config.Layer.Goods) {
            this.camera.layers.enable(Layers.Goods)
        } else {
            this.camera.layers.disable(Layers.Goods)
        }

        this.cameraHelper.visible = Config.Layer.Helper
        this.hemiHelper.visible = Config.Layer.Helper
        if (Config.Layer.Helper) {
            this.camera.layers.enable(Layers.Helper)
        } else {
            this.camera.layers.disable(Layers.Helper)
        }
        
        this.cameraHelper.update()
        this.hemiHelper.update()

        this.stats.update()
        this.renderer?.render(this.scene, this.camera);

    }

    start(): void {
        this.init()
        this.animate()
    }
}
export default World