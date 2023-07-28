package model

/**
* @Author: Connor
* @Date:   23.7.27 16:29
* @Description:
 */

type LocationConf struct {
	Pk
	LocationId int // 对应系统库位ID，每个库位对应一个库位配置信息，用于在3D模型中展示
	AreaConfId int // 所属区域配置ID
	RelX       int // 相对于区域的坐标
	RelZ       int // 相对于区域的坐标
	RelY       int // 相对于区域的坐标(y-代表高度)
	PosX       int // 绝对与0点的坐标
	PosZ       int // 绝对与0点的坐标
	PosY       int // 绝对与0点的坐标(y-代表高度)
}
