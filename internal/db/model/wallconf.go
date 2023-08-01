package model

/**
* @Author: Connor
* @Date:   23.7.27 16:29
* @Description:
 */

// WallConf 围墙配置
type WallConf struct {
	Pk
	WarehouseId int    // 所属仓库
	WarehouseNo string //
	Width       int    `orm:"column(w)"` //宽
	Height      int    `orm:"column(h)"` //高
}
