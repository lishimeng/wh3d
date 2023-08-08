package platformConf

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

func stationConfEditApi(ctx iris.Context) {

	var resp respPlatformConfJson
	resp.Code = tool.RespCodeSuccess

	var reqJson reqPlatformConfJson
	errJson := ctx.ReadJSON(&reqJson)
	if errJson != nil {
		log.Info("update platformConf failed %v", errJson)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}

	if err := app.GetOrm().Transaction(func(c persistence.TxContext) error {
		conf := model.PlatformConf{}
		conf.Id = reqJson.Id

		if err := c.Context.Read(&conf); err != nil {
			return err
		}

		// 坐标

		conf.PosZ = reqJson.PosZ
		conf.PosX = reqJson.PosX

		// 朝向坐标
		conf.FaceToY = reqJson.FaceY
		conf.FaceToZ = reqJson.FaceZ
		conf.FaceToX = reqJson.FaceX

		if _, err := c.Context.Update(&conf, "PosZ", "PosX", "FaceToY", "FaceToX", "FaceToZ"); err != nil {
			return err
		}
		return nil
	}); err != nil {
		log.Info("update platformConf failed %v", err)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}
	tool.ResponseJSON(ctx, resp)
}
