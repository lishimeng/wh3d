package setup

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/areaConf"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/floorConf"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/locationConf"
	"github.com/lishimeng/wh3d/cmd/wh3d/ddd/platformConf"
	"github.com/lishimeng/wh3d/cmd/wh3d/ws"
)

func Route(app *iris.Application) {
	root := app.Party("/api")
	app.Get("/subscribe", ws.Subscribe) // websocket
	router(root)
	return
}

func router(root iris.Party) {
	areaConf.Router(root.Party("/3d/areaconf"))
	locationConf.Router(root.Party("/3d/locationconf"))
	platformConf.Router(root.Party("/3d/platformconf"))
	floorConf.Router(root.Party("/3d/floorconf"))
}
