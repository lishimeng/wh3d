package threeD

import (
	"github.com/kataras/iris/v12"
)

func Router(p iris.Party) {
	// 根据区域获取所属的托盘列表
	p.Get("/initContainers/{area}", initContainersApi)

	// 计算托盘在区域中的绝对定位 x z y
	p.Get("/calculate/pos/location", calculateLocationPosition)
}
