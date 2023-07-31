import { Object3D, Scene } from "three"
import { DefaultStorage, Storage } from "./Storage"


export default class StoryBoard {

    scene!: Scene
    private storage: Storage

    constructor(scene: Scene) {
        this.scene = scene
        this.storage = DefaultStorage
    }

    getStorage(): Storage {
        return this.storage
    }

    add(obj: Object3D): void {
        this.scene.add(obj)
    }

    remove(obj: Object3D) {
        this.scene.remove(obj)
    }
}