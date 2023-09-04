import {Camera, Color, Scene} from "three"
import Config from "./Config"

export enum Layers {
    Environment = 0,
    Light = 1,
    Facility = 2,
    Goods = 3,
    Helper = 4

}

class LayerManager {
    config = Config
    camera!: Camera
    scene!: Scene

    update() : void {
        // console.log(new Date())
        // console.log(Config.Layer.Environment)
        // console.log(Config.Layer.Facility)
        // console.log(Config.Layer.Light)
        // console.log(Config.Layer.Goods)
        // console.log(Config.Layer.Helper)
        //
        if (!this.camera) {
            return
        }
        if (Config.Layer.Environment) {
            this.camera.layers.enable(Layers.Environment)
        } else {
            this.camera.layers.disable(Layers.Environment)
            this.scene.background = new Color(0x262838)
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

        if (Config.Layer.Helper) {
            this.camera.layers.enable(Layers.Helper)
        } else {
            this.camera.layers.disable(Layers.Helper)
        }
    }
}

export const DefaultLayerManager = new LayerManager()
