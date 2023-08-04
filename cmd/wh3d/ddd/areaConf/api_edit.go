package areaConf

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
* @Date:   23.8.2 10:36
* @Description:
 */

func editAreaConfApi(ctx iris.Context) {

	var resp respAreaConfJson
	resp.Code = tool.RespCodeSuccess

	var reqJson reqAreaConfJson
	errJson := ctx.ReadJSON(&reqJson)
	if errJson != nil {
		log.Info("update locationConf failed %v", errJson)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}

	if err := app.GetOrm().Transaction(func(c persistence.TxContext) error {

		conf := model.AreaConf{}
		conf.Id = reqJson.Id

		if err := c.Context.Read(&conf); err != nil {
			return err
		}

		// 修改 x y z width、height
		conf.PosX = reqJson.X
		conf.PosY = reqJson.Y
		conf.PosZ = reqJson.Z
		conf.Width = reqJson.Width
		conf.Height = reqJson.Height

		if _, err := c.Context.Update(&conf, "PosX", "PosY", "PosZ", "Width", "Height"); err != nil {
			return err
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
