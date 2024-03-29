package locationConf

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
* @Date:   23.7.28 09:53
* @Description:
 */

// 计算库位对应所属区域的绝对坐标值 x z y
func calculateLocationPosition(ctx iris.Context) {
	var resp respLocationConfJson
	resp.Code = tool.RespCodeSuccess

	if err := app.GetOrm().Transaction(func(context persistence.TxContext) error {

		locations := make([]model.LocationConf, 0)

		if _, err := context.Context.QueryTable(model.LocationConf{}).All(&locations); err != nil {
			return err
		}

		for _, item := range locations {
			// 找到对应 区域配置 xzy坐标
			areaConfId := item.AreaConfId

			conf := model.AreaConf{}
			conf.Id = areaConfId
			if err := context.Context.Read(&conf); err != nil {
				continue
			}
			// 计算相量坐标值
			// 区域在图中的绝对坐标+库位相对于区域的坐标= 库位在图中的绝对坐标
			item.PosX = item.RelX + conf.PosX
			item.PosY = item.RelY + conf.PosY
			item.PosZ = item.RelZ + conf.PosZ

			if _, err := context.Context.Update(&item, "PosX", "PosY", "PosZ"); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		log.Info(err)
		resp.Code = tool.RespCodeError
		tool.ResponseJSON(ctx, resp)
		return
	}
	tool.ResponseJSON(ctx, resp)
}
