package floorConf

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

func floorConfEdit(ctx iris.Context) {

	var resp respFloorConfJson
	resp.Code = tool.RespCodeSuccess

	var reqJson reqFloorConfJson
	errJson := ctx.ReadJSON(&reqJson)
	if errJson != nil {
		log.Info("update floorConf failed %v", errJson)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}

	if err := app.GetOrm().Transaction(func(c persistence.TxContext) error {
		conf := model.FloorConf{}
		conf.Id = reqJson.Id

		if err := c.Context.Read(&conf); err != nil {
			return err
		}

		conf.Width = reqJson.Width
		conf.Height = reqJson.Height

		if _, err := c.Context.Update(&conf, "Width", "Height"); err != nil {
			return err
		}
		return nil
	}); err != nil {
		log.Info("update floorConf failed %v", err)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}
	tool.ResponseJSON(ctx, resp)
}
