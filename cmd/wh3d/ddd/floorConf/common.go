package floorConf

import "github.com/lishimeng/app-starter"

// ReqSkuJson  请求封装dto
type reqFloorConfJson struct {
	Id     int `json:"id"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type floorConfJson struct {
	Id     int    `json:"id"`
	WhNo   string `json:"whNo"`
	WhId   int    `json:"whId"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Ctime  string `json:"ctime"`
}

// RespLocationInfoJson  请求响应数据
type respFloorConfJson struct {
	app.Response
	Data interface{} `json:"data"`
}

// 定义接口返回错误、成功msg信息
const ()
