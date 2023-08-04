package floorConf

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/model"
)

/**
* @Author: Connor
* @Date:   23.8.1 14:22
* @Description:
 */

func floorConfPageListApi(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = common.RespCodeSuccess

	warehouseNo := ctx.URLParamDefault("warehouseNo", "")

	var pageSize = ctx.URLParamIntDefault("pageSize", common.DefaultPageSize)
	var pageNo = ctx.URLParamIntDefault("pageNo", common.DefaultPageNo)

	page := app.Pager{
		PageSize: pageSize,
		PageNum:  pageNo,
	}
	list, err := listPage(warehouseNo, &page)
	if err != nil {
		return
	}

	for _, c := range list {

		json := floorConfJson{
			Id:     c.Id,
			WhNo:   c.WarehouseNo,
			WhId:   c.WarehouseId,
			Width:  c.Width,
			Height: c.Height,
		}
		page.Data = append(page.Data, json)
	}

	resp.Pager = page
	common.ResponseJSON(ctx, resp)

}

func listPage(warehouseNo string, page *app.Pager) (appInfos []model.FloorConf, err error) {
	//筛选项
	cond := orm.NewCondition()
	if len(warehouseNo) > 0 {
		cond = cond.And("warehouseNo", warehouseNo)
	}
	var qs = app.GetOrm().Context.QueryTable(new(model.FloorConf)).SetCond(cond)
	sum, err1 := qs.Count()

	if err1 != nil {
		err = err1
		return
	}
	page.TotalPage = common.CalcTotalPage(page, sum)
	page.More = int(sum)

	if _, err = qs.OrderBy("WarehouseNo").Offset(common.CalcPageOffset(page)).Limit(page.PageSize).SetCond(cond).All(&appInfos); err != nil {
		return
	}
	return
}
