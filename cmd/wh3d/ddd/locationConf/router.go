package locationConf

import (
	"github.com/kataras/iris/v12"
)

func Router(p iris.Party) {

	// 分页查询库位配置信息
	p.Get("/", locationConfPageListApi)

	// 根据区域获取所属的托盘列表
	p.Get("/initContainers", initContainersApi)

	// 计算托盘在区域中的绝对定位 x z y
	p.Get("/calculate/pos/location", calculateLocationPosition)

	// 修改库位对应的库位X、RelY、Z配置信息
	p.Post("/update/location/conf", locationConfEdit)

	// 初始化配置库 A511
	//p.Get("/initlocation", initLocationForA511)

	// 初始化配置库 A610
	//p.Get("/initlocation/a610", initLocationForA610)
}
