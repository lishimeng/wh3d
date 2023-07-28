package threeD

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/ddd/common"
	"github.com/lishimeng/wh3d/internal/db/model"
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

	area := ctx.Params().GetStringDefault("area", "")
	if len(area) == 0 {
		resp.Code = common.RespCodeError
		common.ResponseJSON(ctx, ctx)
		return
	}

	aoc := app.GetOrm().Context
	containers := make([]view.InventoryContainerItemInfoView, 0)
	_, err := aoc.QueryTable(new(view.InventoryContainerItemInfoView)).Filter("dimension_area", area).
		Filter("group", 115).All(&containers)
	if err != nil {
		resp.Code = common.RespCodeError
		common.ResponseJSON(ctx, ctx)
		return
	}
	for _, container := range containers {

		// 加上对应 区域的相对XYZ
		// warehosue
		warehouse := model.AreaConf{
			No: container.DimensionArea,
		}
		if err := aoc.Read(&warehouse, "No"); err != nil {
			log.Info(err, container.DimensionArea)
			continue
		}

		// X 控制x轴
		// Z 控制y轴
		// Y 控制高度-
		//pos.X += warehouse.PositionX
		//pos.Y += warehouse.PositionY
		//pos.Z += warehouse.PositionZ

		//pos.X = warehouse.PositionX + container.RelX
		//pos.Y = warehouse.PositionY + container.RelY
		//pos.Z = warehouse.PositionZ + container.RelZ

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

// 处理字符串，获取x,y,z。如 x-y-z => {X:x,Y:y,Z:z}
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
