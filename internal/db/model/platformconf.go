package model

/**
* @Author: Connor
* @Date:   23.7.28 10:53
* @Description:
 */

// PlatformConf 仓库站台配置
type PlatformConf struct {
	Pk
	// 编号
	No string

	// 坐标
	PosX int
	PosY int
	PosZ int

	// 朝向
	FaceToX       float64
	FaceToY       float64
	FaceToZ       float64
	DimensionArea string // 所属区域
}

func (u *PlatformConf) TableName() string {
	return "station_conf"
}
