package setup

import (
	"context"
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
	han = append(han) //process.AmqpStart,
	// TODO ws.Te, 测试webscoket 通信页面，后续修改为 mq通信消息到页面

	for _, h := range han {
		err = h(ctx)
		if err != nil {
			return
		}
	}
	return
}
