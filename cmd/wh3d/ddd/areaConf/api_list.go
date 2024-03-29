package areaConf

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/model"
)

/**
* @Author: Connor
* @Date:   23.8.2 10:16
* @Description:
 */

func areaConfPageListApi(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = common.RespCodeSuccess

	area := ctx.URLParamDefault("area", "")
	warehouseNo := ctx.URLParamDefault("warehouseNo", "")

	var pageSize = ctx.URLParamIntDefault("pageSize", common.DefaultPageSize)
	var pageNo = ctx.URLParamIntDefault("pageNo", common.DefaultPageNo)

	page := app.Pager{
		PageSize: pageSize,
		PageNum:  pageNo,
	}
	list, err := listPage(warehouseNo, area, &page)
	if err != nil {
		return
	}

	for _, container := range list {

		json := areaConfPcJson{
			WarehouseId: container.WhId,
			WarehouseNo: container.WhNo,
			AreaNo:      container.No,
			Id:          container.Id,
			X:           container.PosX,
			Y:           container.PosY,
			Z:           container.PosZ,
			Width:       container.Width,
			Height:      container.Height,
		}
		page.Data = append(page.Data, json)
	}

	resp.Pager = page
	common.ResponseJSON(ctx, resp)
}

func listPage(warehouseNo, area string, page *app.Pager) (appInfos []model.AreaConf, err error) {
	//筛选项
	cond := orm.NewCondition()
	if len(area) > 0 {
		cond = cond.And("No", area)
	}
	if len(warehouseNo) > 0 {
		cond = cond.And("WhNo", warehouseNo)
	}

	var qs = app.GetOrm().Context.QueryTable(new(model.AreaConf)).SetCond(cond)
	sum, err1 := qs.Count()

	if err1 != nil {
		err = err1
		return
	}
	page.TotalPage = common.CalcTotalPage(page, sum)
	page.More = int(sum)

	if _, err = qs.OrderBy("PosX", "PosY", "PosZ").Offset(common.CalcPageOffset(page)).Limit(page.PageSize).SetCond(cond).All(&appInfos); err != nil {
		return
	}
	return
}
