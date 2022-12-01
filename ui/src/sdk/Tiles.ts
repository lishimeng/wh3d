import { Vector3 } from "three"
import Config from "./Config"

class Tiles {

    constructor() {

    }

    getZeroPosition() {
        let x = - Config.Global.TilesW * Config.Global.UnitLegth / 2
        let y = - Config.Global.TilesH * Config.Global.UnitLegth / 2
        return new Vector3(x, 0, y)
    }

    getTiles(): number {
        return Config.Global.TilesW * Config.Global.TilesH
    }
}

export const DefaultTiles = new Tiles()