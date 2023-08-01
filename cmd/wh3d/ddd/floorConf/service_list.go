package floorConf

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/wh3d/internal/db/model"
)

/**
* @Author: Connor
* @Date:   23.7.26 15:34
* @Description:
 */

func serviceFindAll(whNo string) (data []model.FloorConf, err error) {
	//筛选项
	cond := orm.NewCondition()

	cond = cond.And("WarehouseNo", whNo)

	var qs = app.GetOrm().Context.QueryTable(new(model.FloorConf)).SetCond(cond)

	if _, err = qs.OrderBy("WarehouseNo").SetCond(cond).All(&data); err != nil {
		return
	}
	return
}
