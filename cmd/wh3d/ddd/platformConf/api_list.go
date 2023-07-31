package platformConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/go-log"
)

// 门禁列表
func apiList(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = tool.RespCodeSuccess

	dimensionArea := ctx.URLParamDefault("whNo", "")

	if dimensionArea == "" {
		resp.Code = tool.RespCodeError
		resp.Message = "无效参数"
		tool.ResponseJSON(ctx, resp)
		return
	}
	log.Info("apiList.ListPage (%s,%s,%s, %d,%d, %d)")

	list, err := serviceFindAll(dimensionArea)

	if err != nil {
		log.Info("apiList failed %s", err)
		resp.Code = tool.RespCodeError
		resp.Message = ""
		tool.ResponseJSON(ctx, resp)
		return
	}
	if len(list) > 0 {
		for _, item := range list {
			json := platformConfJson{
				Id:   item.Id,
				WhNo: item.DimensionArea,
				No:   item.No,
				pos: pos{
					X: item.PosX,
					Y: item.PosY,
					Z: item.PosZ,
				},
				face: face{
					X: item.FaceToX,
					Y: item.FaceToY,
					Z: item.FaceToZ,
				},
				//size: size{
				//	H: item.Height,
				//	W: item.Width,
				//},
			}
			resp.Data = append(resp.Data, json)
		}
	}
	tool.ResponseJSON(ctx, resp)
}
