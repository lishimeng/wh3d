package platformConf

import "github.com/lishimeng/app-starter"

// ReqSkuJson  请求封装dto
type reqPlatformConfJson struct {
	Id int `json:"id"`
}

type platformConfJson struct {
	Id    int    `json:"id"`
	WhNo  string `json:"whNo"` // 所属仓库-A511/A610/...
	No    string `json:"name"` // 区域名称
	pos   `json:"pos"`
	face  `json:"faceTo"`
	size  `json:"size"`
	Ctime string `json:"ctime"`
}

type pos struct {
	X int `json:"x"` // X轴坐标
	Y int `json:"y"` // Y轴坐标
	Z int `json:"z"` // Z轴坐标
}
type face struct {
	X float64 `json:"x"` // X轴坐标
	Y float64 `json:"y"` // Y轴坐标
	Z float64 `json:"z"` // Z轴坐标
}
type size struct {
	W int `json:"w"` // 宽度
	H int `json:"h"` // 长度
}

// RespLocationInfoJson  请求响应数据
type respPlatformConfJson struct {
	app.Response
	Data interface{} `json:"data"`
}

// 定义接口返回错误、成功msg信息
const ()
