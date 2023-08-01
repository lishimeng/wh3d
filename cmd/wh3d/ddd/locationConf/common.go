package locationConf

import "github.com/lishimeng/app-starter"

// ReqSkuJson  请求封装dto
type reqLocationConfJson struct {
	Id int `json:"id"`
}

type locationConfJson struct {
	ConfId      int    `json:"confId"`     // 库位坐标配置id：无即为添加，有即为修改
	LocationId  int    `json:"locationId"` // 对应的库存库位id
	LocationNo  string `json:"locationNo"`
	WarehouseId int    `json:"warehouseId"`
	WarehouseNo string `json:"warehouseNo"`
	Area        string `json:"area"`
	RelX        int    `json:"relX"` //
	RelY        int    `json:"RelY"` //
	RelZ        int    `json:"RelZ"` //
	PosX        int    `json:"posX"`
	PosY        int    `json:"posY"`
	PosZ        int    `json:"posZ"`
}

type pos struct {
	X int `json:"x"` // X轴坐标
	Y int `json:"y"` // Y轴坐标
	Z int `json:"z"` // Z轴坐标
}
type size struct {
	W int `json:"w"` // 宽度
	H int `json:"h"` // 长度
}

// RespLocationInfoJson  请求响应数据
type respLocationConfJson struct {
	app.Response
	Data interface{} `json:"data"`
}

// 定义接口返回错误、成功msg信息
const ()
