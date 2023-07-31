import { Color, Vector3 } from "three"

//  地图以瓦片方格编号，每个单位方格: Config.Camare.Far, Config.Camare.Far

const UnitLegth = 4

const TilesW = 80
const TilesH = 80

const GlobalConfig = {
    UnitLegth: UnitLegth,
    TilesW: TilesW,
    TilesH: TilesH,
    Offset: new Vector3(0, 0, 80),
    Container: {
        Width: UnitLegth // 托盘占用一个瓦片大小
    }
}

const CamareConfig = {
    location: 'normal',
    Control: false,
    Lock: false,
    Far: 3000, // 摄像机最大视野
    NormalPos: new Vector3(0, 200, 200)
}

const LayerConfig = {
    Environment: true,
    Light: true,
    Facility: true,
    Goods: true,
    Helper: false
}

const HelperConfig = {
    GridColor: new Color(0x0000ff)
}

const Config = {
    Global: GlobalConfig,
    Camare: CamareConfig,
    Layer: LayerConfig,
    Helper: HelperConfig
}

export default Config
