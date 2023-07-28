package model

/**
* @Author: Connor
* @Date:   23.7.26 15:24
* @Description:
 */

// AreaConf 仓库区域配置

type AreaConf struct {
	Pk
	WhNo      string `orm:"column(wh_no)"`      // 所属仓库-A511/A610/...
	No        string `orm:"column(no)"`         // 区域名称
	PositionX int    `orm:"column(position_x)"` // X轴坐标
	PositionY int    `orm:"column(position_y)"` // Y轴坐标
	PositionZ int    `orm:"column(position_z)"` // Z轴坐标
	Width     int    `orm:"column(width)"`      // 宽度
	Height    int    `orm:"column(height)"`     // 长度
	TableChangeInfo
}
