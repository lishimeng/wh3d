package db

import (
	"github.com/lishimeng/wh3d/internal/db/model"
	"github.com/lishimeng/wh3d/internal/db/view"
)

func RegisterTables() (tables []interface{}) {
	tables = append(tables,
		new(model.AreaConf),                           // 区域配置
		new(model.LocationConf),                       // 库位配置
		new(model.PlatformConf),                       // 站台配置
		new(view.InventoryContainerItemInfoFor3dView), // 库存视图
		new(model.LocationInfo),                       // 库位信息
		new(model.FloorConf))                          // 地板信息
	return
}
