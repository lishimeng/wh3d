package db

import (
	"github.com/lishimeng/wh3d/internal/db/model"
	"github.com/lishimeng/wh3d/internal/db/view"
)

func RegisterTables() (tables []interface{}) {
	tables = append(tables,
		new(model.AreaConf),                      // 区域配置
		new(model.LocationConf),                  // 库位配置
		new(model.PlatformConf),                  // 站台配置
		new(view.InventoryContainerItemInfoView)) // 库存视图
	return
}
