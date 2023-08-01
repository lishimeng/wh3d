package floorConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
)

// 门禁列表
func apiList(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = tool.RespCodeSuccess

	whNo := ctx.URLParamDefault("whNo", "")

	if whNo == "" {
		resp.Code = common.RespCodeServerError
		resp.Message = "无效参数"
		common.ResponseJSON(ctx, resp)
		return
	}
	log.Info("apiList.ListPage (%s,%s,%s, %d,%d, %d)")

	list, err := serviceFindAll(whNo)

	if err != nil {
		log.Info("apiList failed %s", err)
		resp.Code = common.RespCodeServerError
		resp.Message = ""
		common.ResponseJSON(ctx, resp)
		return
	}
	if len(list) > 0 {
		for _, item := range list {
			json := floorConfJson{
				Id:     item.Id,
				WhNo:   item.WarehouseNo,
				WhId:   item.WarehouseId,
				Width:  item.Width,
				Height: item.Height,
			}
			resp.Data = append(resp.Data, json)
		}
	}
	common.ResponseJSON(ctx, resp)
}
