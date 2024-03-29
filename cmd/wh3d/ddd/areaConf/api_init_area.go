package areaConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
)

// 门禁列表
func apiListFor3D(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = tool.RespCodeSuccess

	whNo := ctx.URLParamDefault("whNo", "")

	if whNo == "" {
		resp.Code = common.RespCodeServerError
		resp.Message = "无效参数"
		common.ResponseJSON(ctx, resp)
		return
	}
	log.Info("apiListFor3D.ListPage (%s,%s,%s, %d,%d, %d)")

	list, err := serviceFindAll(whNo)

	if err != nil {
		log.Info("apiListFor3D failed %s", err)
		resp.Code = common.RespCodeServerError
		resp.Message = ""
		common.ResponseJSON(ctx, resp)
		return
	}
	if len(list) > 0 {
		for _, item := range list {
			json := areaConfJson{
				Id:   item.Id,
				WhNo: item.WhNo,
				WhId: item.WhId,
				No:   item.No,
				pos: pos{
					X: item.PosX,
					Y: item.PosY,
					Z: item.PosZ,
				},
				size: size{
					H: item.Height,
					W: item.Width,
				},
			}
			resp.Data = append(resp.Data, json)
		}
	}
	common.ResponseJSON(ctx, resp)
}
