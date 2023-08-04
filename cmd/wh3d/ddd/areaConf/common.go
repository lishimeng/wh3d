package areaConf

import "github.com/lishimeng/app-starter"

// ReqSkuJson  请求封装dto
type reqAreaConfJson struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Z      int `json:"z"`
	Width  int `json:"width"`
	Height int `json:"height"`
	Id     int `json:"id"`
}

type areaConfPcJson struct {
	Id          int    `json:"id"`
	AreaNo      string `json:"areaNo"`
	WarehouseId int    `json:"warehouseId"`
	WarehouseNo string `json:"warehouseNo"`
	X           int    `json:"x"`
	Y           int    `json:"y"`
	Z           int    `json:"z"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
}

type areaConfJson struct {
	Id    int    `json:"id"`
	WhNo  string `json:"whNo"` // 所属仓库-A511/A610/...
	No    string `json:"name"` // 区域名称
	pos   `json:"pos"`
	size  `json:"size"`
	Ctime string `json:"ctime"`
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
type respAreaConfJson struct {
	app.Response
	Data interface{} `json:"data"`
}

// 定义接口返回错误、成功msg信息
const ()
