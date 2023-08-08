package platformConf

import (
	"github.com/kataras/iris/v12"
)

func Router(p iris.Party) {
	p.Get("/", apiList)
	p.Get("/pc", stationConfPageListApi)

	p.Put("/", stationConfEditApi)
}
