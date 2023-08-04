package areaConf

import (
	"github.com/kataras/iris/v12"
)

func Router(p iris.Party) {
	p.Get("/", apiListFor3D)

	// 后台列表
	p.Get("/pc", areaConfPageListApi)
	// 修改配置
	p.Put("/", editAreaConfApi)
}
