package locationConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/view"
)

type position struct {
	X int `json:"x"`
	Y int `json:"y"`
	Z int `json:"z"`
}

type containerInfo struct {
	Name     string   `json:"name,omitempty"`
	Location string   `json:"area,omitempty"`
	Pos      position `json:"pos,omitempty"`
}

func initContainersApi(ctx iris.Context) {
	var resp app.PagerResponse

	warehouseId := ctx.URLParamIntDefault("warehouseId", 0)
	area := ctx.URLParamDefault("area", "")

	aoc := app.GetOrm().Context
	containers := make([]view.InventoryContainerItemInfoView, 0)
	_, err := aoc.QueryTable(new(view.InventoryContainerItemInfoView)).
		Filter("dimension_area", area).
		Filter("warehouse_id", warehouseId).
		Filter("pos_x__gte", 0).
		OrderBy("-PosX", "-PosY", "-PosZ").
		All(&containers)
	if err != nil {
		resp.Code = tool.RespCodeError
		common.ResponseJSON(ctx, ctx)
		return
	}

	for _, container := range containers {

		pos := position{
			X: container.PosX,
			Y: container.PosY,
			Z: container.PosZ,
		}
		c := containerInfo{
			Name:     container.ContainerNo,
			Location: area,
			Pos:      pos,
		}
		resp.Data = append(resp.Data, c)
	}

	//maps := make([]position, 0)
	//
	//_, err := aoc.Raw(`select pos_x as x ,pos_z as z,pos_y as y from location_conf t1 where warehouse_id = 4 AND area = 'H'`).QueryRows(&maps)
	//if err != nil {
	//	return
	//}
	//
	//for index, item := range maps {
	//	formatInt := strconv.FormatInt(int64(index), 10)
	//	c := containerInfo{
	//		Name:     formatInt,
	//		Location: area,
	//		Pos:      item,
	//	}
	//	resp.Data = append(resp.Data, c)
	//}

	//log.Info(maps)
	resp.Code = common.RespCodeSuccess
	common.ResponseJSON(ctx, resp)

}
