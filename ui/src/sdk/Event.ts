import { Camera, Raycaster, Scene, Vector2 } from "three";
import { Label } from "./models/Label";
import { DefaultLayerManager, Layers } from "./Layers";
import { DefaultStorage } from "./Storage";

class EventHandler {

    pointer: Vector2 = new Vector2()
    raycaster: Raycaster = new Raycaster()

    constructor() {
        this.init()
    }

    init(): void {
        console.log("raycaster layer:" + Layers.Goods)
        this.raycaster.layers.set(Layers.Goods)
    }

    addListener(): void {

    }

    onEvent(data: any, location: Vector2) {
        console.log(data)
        console.log(location)
    }

    update(scene: Scene, camera: Camera) {
        this.raycaster.setFromCamera(this.pointer, camera)

        let containers = this.raycaster.intersectObjects(scene.children)

        console.log("raycaster size:" + containers.length)
        if (containers.length < 1) {
            return;
        }
        let c = containers[0]
        console.log(c)
        this.onEvent(c.object.userData, this.pointer)
    }

    updtePointer(x: number, y: number) {
        this.pointer.set(x, y)
    }
}

export const DefaultEventManager = new EventHandler()