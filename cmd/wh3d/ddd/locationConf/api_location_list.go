package locationConf

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/view"
)

/**
* @Author: Connor
* @Date:   23.8.1 14:22
* @Description:
 */

func locationConfPageListApi(ctx iris.Context) {
	var resp app.PagerResponse
	resp.Code = common.RespCodeSuccess

	area := ctx.URLParamDefault("area", "")
	warehouseNo := ctx.URLParamDefault("warehouseNo", "")
	locationNo := ctx.URLParamDefault("locationNo", "")

	var pageSize = ctx.URLParamIntDefault("pageSize", common.DefaultPageSize)
	var pageNo = ctx.URLParamIntDefault("pageNo", common.DefaultPageNo)

	page := app.Pager{
		PageSize: pageSize,
		PageNum:  pageNo,
	}
	list, err := listPage(warehouseNo, locationNo, area, &page)
	if err != nil {
		return
	}

	for _, container := range list {

		json := locationConfJson{
			ConfId:      container.LocationConfId,
			LocationId:  container.LocationId,
			LocationNo:  container.LocationNo,
			Area:        container.Area,
			WarehouseId: container.WarehouseId,
			WarehouseNo: container.WarehouseNo,
			//RelX:        0,
			//RelY:        0,
			//RelZ:        0,
			PosX: container.PosX,
			PosY: container.PosY,
			PosZ: container.PosZ,
		}
		page.Data = append(page.Data, json)
	}

	resp.Pager = page
	common.ResponseJSON(ctx, resp)

}

func listPage(warehouseNo, locationNo, area string, page *app.Pager) (appInfos []view.InventoryContainerItemInfoView, err error) {
	//筛选项
	cond := orm.NewCondition()
	if len(area) > 0 {
		cond = cond.And("area", area)
	}
	if len(warehouseNo) > 0 {
		cond = cond.And("warehouseNo", warehouseNo)
	}
	if len(locationNo) > 0 {
		cond = cond.And("locationNo__contains", locationNo)
	}
	var qs = app.GetOrm().Context.QueryTable(new(view.InventoryContainerItemInfoView)).SetCond(cond)
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
