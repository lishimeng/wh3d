package floorConf

import "github.com/lishimeng/app-starter"

// ReqSkuJson  请求封装dto
type reqFloorConfJson struct {
	Id int `json:"id"`
}

type floorConfJson struct {
	Id     int    `json:"id"`
	WhNo   string `json:"whNo"`
	WhId   int    `json:"whId"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Ctime  string `json:"ctime"`
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
type respFloorConfJson struct {
	app.Response
	Data interface{} `json:"data"`
}

// 定义接口返回错误、成功msg信息
const ()
