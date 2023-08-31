package view

import "github.com/lishimeng/wh3d/internal/db/model"

type InventoryContainerItemInfoFor3dView struct {
	ContainerId   int    `orm:"column(container_id);null"`
	ContainerNo   string `orm:"column(container_no);null"`   // 托盘号
	WarehouseId   int    `orm:"column(warehouse_id);null"`   // 仓库ID
	WarehouseNo   string `orm:"column(warehouse_no);null"`   // 仓库编号
	LocationId    int    `orm:"column(location_id);null"`    // 库位ID
	LocationNo    string `orm:"column(location_no);null"`    // 库位编号
	Dimensions    string `orm:"column(dimensions);null"`     // 3D展示的维度坐标值：x-y-z 如 0-0-0，表示相对于区域原点的坐标
	DimensionArea string `orm:"column(dimension_area);null"` // 3D展示的区域名称
	IsFull        int    `orm:"column(is_full);null"`        // 是否满托：10，默认是；20；否；
	IsStandard    int    `orm:"column(is_standard);null"`    // 是否标准托：10，默认是；20；否；
	IsReserved    int    `orm:"column(is_reserved);null"`    // 是否预留（默认为否）：10，是；20，否；
	SpuId         int    `orm:"column(spu_id);null"`         // 产品ID
	SpuNo         string `orm:"column(spu_no);null"`         // 产品编号
	SpuName       string `orm:"column(spu_name);null"`       // 产品名称
	SkuId         int    `orm:"column(sku_id);null"`         // 物料ID
	SkuNo         string `orm:"column(sku_no);null"`         // 物料编号
	SkuName       string `orm:"column(sku_name);null"`       // 物料名称
	BatchNo       string `orm:"column(batch_no);null"`       // 批次号
	Amount        int    `orm:"column(amount);null"`         // 托盘上物品数量
	Volume        int    `orm:"column(volume);null"`         // 物料单位容量
	TotalVolume   int    `orm:"column(total_volume);null"`   // 托盘上物品总容量
	ItemNo        string `orm:"column(item_no);null"`        // 桶标签
	IsDel         bool   `orm:"column(is_del);"`             // 逻辑删除 false可以使用，true无法使用
	Group         int    `orm:"column(group);"`              // 库位-组
	Area          string `orm:"column(area);"`               // 库位-区域
	// 库位配置坐标
	LocationConfId int `orm:"column(location_conf_id)"`
	PosX           int `orm:"column(pos_x);"`
	PosY           int `orm:"column(pos_y);"`
	PosZ           int `orm:"column(pos_z);"`

	model.TableChangeInfo
	model.DeptOrgTableInfo
}

// TableUnique 多字段唯一键
func (li *InventoryContainerItemInfoFor3dView) TableUnique() [][]string {
	return [][]string{
		{"ContainerId", "SkuId", "BatchNo", "ItemNo"},
	}
}
