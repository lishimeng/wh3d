package locationConf

import (
	"github.com/kataras/iris/v12"
)

func Router(p iris.Party) {
	// 根据区域获取所属的托盘列表
	p.Get("/initContainers", initContainersApi)

	// 计算托盘在区域中的绝对定位 x z y
	p.Get("/calculate/pos/location", calculateLocationPosition)

	// 修改库位对应的库位X、Y、Z配置信息
	p.Post("/update/location/conf", locationConfEdit)
}
