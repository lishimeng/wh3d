package locationConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/persistence"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/model"
)

/**
* @Author: Connor
* @Date:   23.7.31 15:26
* @Description:
 */

func locationConfEdit(ctx iris.Context) {

	var resp respLocationConfJson
	resp.Code = tool.RespCodeSuccess

	var reqJson locationConfJson
	errJson := ctx.ReadJSON(&reqJson)
	if errJson != nil {
		log.Info("update locationConf failed %v", errJson)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}

	if err := app.GetOrm().Transaction(func(c persistence.TxContext) error {
		// 库位信息
		locationInfo := model.LocationInfo{}
		locationInfo.Id = reqJson.LocationId

		if err := c.Context.Read(&locationInfo); err != nil {
			return err
		}

		// 区域配置
		areaConf := model.AreaConf{}
		areaConf.No = locationInfo.Area

		if err := c.Context.Read(&areaConf, "No"); err != nil {
			return err
		}

		// 库位配置
		conf := model.LocationConf{}
		conf.Id = reqJson.ConfId

		if err := c.Context.Read(&conf); err != nil || conf.Id == 0 {
			// 新增
			conf.LocationId = reqJson.LocationId

			calculatePositionYZX(&conf, &reqJson, &areaConf)

			if _, err = c.Context.Insert(&conf); err != nil {
				return err
			}
		} else {
			calculatePositionYZX(&conf, &reqJson, &areaConf)

			if _, err = c.Context.Update(&conf, "RelX", "RelY", "RelZ", "PosX", "PosY", "PosZ"); err != nil {
				return err
			}
		}

		return nil
	}); err != nil {
		log.Info("update locationConf failed %v", err)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}
	tool.ResponseJSON(ctx, resp)
}

func calculatePositionYZX(conf *model.LocationConf, reqJson *locationConfJson, areaConf *model.AreaConf) {
	// 库位相对坐标（区域）
	conf.RelX = reqJson.RelX
	conf.RelY = reqJson.RelY
	conf.RelZ = reqJson.RelZ

	// 绝对坐标（在地图中的0点坐标位置）
	conf.PosX = reqJson.RelX + areaConf.PosX
	conf.PosY = reqJson.RelY + areaConf.PosY
	conf.PosZ = reqJson.RelZ + areaConf.PosZ

	conf.AreaConfId = areaConf.Id
}

type location struct {
	WarehouseId   int
	WarehouseNo   string
	LocationId    int
	LocationNo    string
	Dimensions    string
	DimensionArea string
	Area          string
	Group         int
	X             int
	Z             int
	Y             int
}

func initLocationForA511(ctx iris.Context) {
	var resp respLocationConfJson
	resp.Code = tool.RespCodeSuccess

	warehouseId := ctx.URLParamIntDefault("warehouseId", 0)

	if warehouseId == 0 {
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}
	locations := make([]location, 0)
	aoc := app.GetOrm().Context

	_, err := aoc.Raw(`SELECT
	container_no,
	warehouse_id,
	warehouse_no,
	location_id,
	location_no,
	dimensions,
	dimension_area,
	area,
	SPLIT_PART( dimensions, '-', 1 ) AS x,
	SPLIT_PART( dimensions, '-', 3 ) AS z,
	SPLIT_PART( dimensions, '-', 2 ) AS y 
FROM
	inventory_container_item_info_for3d_view 
WHERE
	warehouse_id = ?
	AND dimensions IS NOT NULL 
ORDER BY
	"group"`, warehouseId).QueryRows(&locations)
	if err != nil {
		log.Info(err)
	}

	for _, item := range locations {
		// 创建每一个库位配置，并计算对决定位
		conf := model.AreaConf{}
		conf.No = item.DimensionArea
		conf.WhId = item.WarehouseId
		err := aoc.Read(&conf, "No", "WhId")
		if err != nil {
			log.Error(err)
			continue
		}

		// 计算绝对坐标
		x := item.X + conf.PosX
		y := item.Y + conf.PosY
		z := item.Z + conf.PosZ

		locationConf := model.LocationConf{
			LocationId:  item.LocationId,
			WarehouseId: item.WarehouseId,
			AreaConfId:  item.WarehouseId,
			Area:        item.DimensionArea,
			RelX:        item.X,
			RelZ:        item.Z,
			RelY:        item.Y,
			PosX:        x,
			PosZ:        z,
			PosY:        y,
		}
		_, err = aoc.Insert(&locationConf)
		if err != nil {
			log.Error(err)
			continue
		}
	}

	tool.ResponseJSON(ctx, resp)
}

func initLocationForA610(ctx iris.Context) {
	var resp respLocationConfJson
	resp.Code = tool.RespCodeSuccess

	warehouseId := ctx.URLParamIntDefault("warehouseId", 0)
	//area := ctx.URLParamDefault("area", "")

	if warehouseId == 0 {
		resp.Code = common.RespCodeServerError
		tool.ResponseJSON(ctx, resp)
		return
	}
	locations := make([]location, 0)
	aoc := app.GetOrm().Context

	_, err := aoc.Raw(`
SELECT
	warehouse_id,
	warehouse_no,
	ID AS location_id,
	location_no,
	description AS area,
	"order" AS x,
	layer AS y,
	"group" 
FROM
	location_info 
WHERE
	warehouse_id = ?
ORDER BY
	"order",
	layer`, warehouseId).QueryRows(&locations)
	if err != nil {
		log.Info(err)
	}

	for _, item := range locations {
		// 创建每一个库位配置，并计算定位
		conf := model.AreaConf{}
		conf.No = item.Area
		conf.WhId = item.WarehouseId
		err := aoc.Read(&conf, "No", "WhId")
		if err != nil {
			log.Error(err)
			continue
		}

		// 计算绝对坐标
		//x := item.X + 20 + conf.PosX

		//x := item.X + tempX + conf.PosX
		//y := item.Y + conf.PosY
		//z := tempZ + conf.PosZ

		x := item.X + conf.PosX
		y := item.Y + conf.PosY
		z := item.Z + conf.PosZ

		locationConf := model.LocationConf{
			LocationId:  item.LocationId,
			WarehouseId: item.WarehouseId,
			AreaConfId:  item.WarehouseId,
			Area:        conf.No,
			RelX:        item.X - 1,
			RelZ:        item.Z,
			RelY:        item.Y,
			PosX:        x - 1,
			PosZ:        z,
			PosY:        y,
		}
		_, err = aoc.Insert(&locationConf)
		if err != nil {
			log.Error(err)
			continue
		}
	}

	tool.ResponseJSON(ctx, resp)
}
