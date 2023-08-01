package locationConf

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/app-starter/tool"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/view"
	"strconv"
	"strings"
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

	//area := ctx.Params().GetStringDefault("area", "")
	area := ctx.URLParamDefault("area", "")

	aoc := app.GetOrm().Context
	containers := make([]view.InventoryContainerItemInfoView, 0)
	_, err := aoc.QueryTable(new(view.InventoryContainerItemInfoView)).
		//Offset(0).
		//Limit(10).
		Filter("dimension_area", area).
		All(&containers)
	if err != nil {
		resp.Code = tool.RespCodeError
		common.ResponseJSON(ctx, ctx)
		return
	}

	for _, container := range containers {

		// 加上对应 区域的相对XYZ
		// warehosue
		//warehouse := model.AreaConf{
		//	No: container.DimensionArea,
		//}
		//if err := aoc.Read(&warehouse, "No"); err != nil {
		//	log.Info(err, container.DimensionArea)
		//	continue
		//}

		// RelX 控制x轴
		// RelZ 控制y轴
		// RelY 控制高度-
		//pos.RelX += warehouse.PosX
		//pos.RelY += warehouse.PosY
		//pos.RelZ += warehouse.PosZ

		//pos.RelX = warehouse.PosX + container.RelX
		//pos.RelY = warehouse.PosY + container.RelY
		//pos.RelZ = warehouse.PosZ + container.RelZ

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

	resp.Code = common.RespCodeSuccess
	common.ResponseJSON(ctx, resp)

}

// 处理字符串，获取x,y,z。如 x-y-z => {RelX:x,RelY:y,RelZ:z}
func genPositionByString(xyz string) (p position, err error) {
	var sep = "-"
	ss := strings.Split(xyz, sep)
	if len(ss) == 3 {
		for i, s := range ss {
			dimension := 0
			dimension, err = strconv.Atoi(s)
			if err != nil {
				return
			}
			if i == 0 {
				p.X = dimension
			} else if i == 1 {
				p.Y = dimension
			} else if i == 2 {
				p.Z = dimension
			}
		}
	}
	return
}