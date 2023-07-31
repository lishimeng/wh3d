package platformConf

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

func serviceFindAll(dimensionArea string) (data []model.PlatformConf, err error) {
	//筛选项
	cond := orm.NewCondition()

	cond = cond.And("DimensionArea", dimensionArea)

	var qs = app.GetOrm().Context.QueryTable(new(model.PlatformConf)).SetCond(cond)

	if _, err = qs.OrderBy("No").SetCond(cond).All(&data); err != nil {
		return
	}
	return
}
