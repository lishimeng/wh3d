package model

/**
* @Author: Connor
* @Date:   23.7.27 16:29
* @Description:
 */

// FloorConf 地图地板配置
type FloorConf struct {
	Pk
	WarehouseId int    // 所属仓库
	WarehouseNo string //
	Width       int    `orm:"column(w)"` //宽
	Height      int    `orm:"column(h)"` //高

}
