package locationConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/persistence"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/go-log"
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

			if _, err = c.Context.Update(&conf, "RelX", "RelY", "RelZ", "PosX", "PosY", "Pos"); err != nil {
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
	conf.RelX = reqJson.X
	conf.RelY = reqJson.Y
	conf.RelZ = reqJson.Z

	// 绝对坐标（在地图中的0点坐标位置）
	conf.PosX = reqJson.X + areaConf.PositionX
	conf.PosY = reqJson.Y + areaConf.PositionY
	conf.PosZ = reqJson.Z + areaConf.PositionZ

	conf.AreaConfId = areaConf.Id
}
