package model

/**
* @Author: Connor
* @Date:   23.7.26 15:24
* @Description:
 */

// AreaConf 仓库区域配置
type AreaConf struct {
	Pk
	WhNo   string `orm:"column(wh_no)"`      // 所属仓库-A511/A610/...
	WhId   int    `orm:"column(wh_id)"`      // 所属仓库id
	No     string `orm:"column(no)"`         // 区域名称
	PosX   int    `orm:"column(position_x)"` // X轴坐标（对于左上0.0坐标位置）
	PosY   int    `orm:"column(position_y)"` // Y轴坐标（对于左上0.0坐标位置）
	PosZ   int    `orm:"column(position_z)"` // Z轴坐标（对于左上0.0坐标位置）
	Width  int    `orm:"column(width)"`      // 宽度
	Height int    `orm:"column(height)"`     // 长度
	TableChangeInfo
}
