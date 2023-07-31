package model

// LocationInfo 库位信息
type LocationInfo struct {
	Pk                   // 库位ID
	WarehouseId   int    `orm:"column(warehouse_id);null"`             // *所属仓库ID
	WarehouseNo   string `orm:"column(warehouse_no);"`                 // *所属仓库ID
	LocationNo    string `orm:"column(location_no);null"`              // 库位编号：*仓库编号-组号-序号-层数，如 A610-1-1-1
	Type          int    `orm:"column(type);default(10)"`              // 库位类型：如 10，虚拟库位（堆垛式）、20，真实库位（货架式）
	Partition     int    `orm:"column(partition);default(10)"`         // *库位分区：如 10，整托库区、20，零散库区、30，DMF专属库区、40，饲料级产品专属库区
	Area          string `orm:"column(area);default()"`                // *区域：如 01，02，03，04，05，06，07，08，09，10; 新增字段
	Group         int    `orm:"column(group);null"`                    // *库位分组：所属BIN位（同一列为一组），如 1：最优先推荐
	Order         int    `orm:"column(order);null"`                    // *库位顺序：BIN位上的排序，如 1：最里面
	Layer         int    `orm:"column(layer);null"`                    // *库位所在层数：堆垛式库位初始化3层，如 1：最下面
	Description   string `orm:"column(description);null"`              // 库位描述
	Memo          string `orm:"column(memo);null"`                     // 备注
	EpcNo         string `orm:"column(epc_no);null"`                   // EPC编号
	Dimensions    string `orm:"column(dimensions);default();null"`     // 3D展示的维度坐标值：x-y-z 如 0-0-0，表示相对于区域原点的坐标
	DimensionArea string `orm:"column(dimension_area);default();null"` // 3D展示的区域名称
	DeptOrgTableInfo
	TableChangeInfo
}

// TableUnique 多字段唯一键，保证库位编号唯一： WarehouseId + Group + Order + Layer
func (li *LocationInfo) TableUnique() [][]string {
	return [][]string{
		{"WarehouseId", "Group", "Order", "Layer"},
	}
}

// LocationType 库位类型：10，虚拟库位（堆垛式）；20，真实库位（货架式）
type LocationType int

// LocationType 库位类型：10，虚拟库位（堆垛式）；20，真实库位（货架式）
const (
	LocationTypeVirtual LocationType = (iota + 1) * 10
	LocationTypeReal
)

// LocationPartition 库位分区：10，整托库区、20，零散库区、30，DMF专属库区、40，饲料级产品专属库区
type LocationPartition int

// LocationPartition 库位分区：10，整托库区、20，零散库区、30，DMF专属库区、40，饲料级产品专属库区
const (
	LocationPartitionWhole LocationPartition = (iota + 1) * 10
	LocationPartitionPart
	LocationPartitionDMF
	LocationPartitionFeed
)

// 库位状态
// LocationStatus 库位状态
const (
	LocationStatusActive   = 10 // 空闲：可使用
	LocationStatusInUse    = 20 // 占用：使用中
	LocationStatusInactive = 30 // 禁用：不可使用
	LocationStatusLocked   = 40 // 锁定：已被推荐
)
