package setup

import (
	"context"
	"github.com/lishimeng/wh3d/internal/process"
	"github.com/lishimeng/wh3d/internal/ws"
	"time"
)

type componentHandler func(ctx context.Context) (err error)

func Setup(ctx context.Context) (err error) {
	var components []func() error
	components = append(components)
	for _, component := range components {
		if err = component(); err != nil {
			return
		}
	}

	time.Sleep(time.Second)

	var han []componentHandler
	han = append(han,
		ws.Web,
		process.AmqpStart,
		ws.Te,
	)
	for _, h := range han {
		err = h(ctx)
		if err != nil {
			return
		}
	}
	return
}
