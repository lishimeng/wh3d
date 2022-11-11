package mq

import (
	"context"
)

const (
	defaultExchange = "amq.direct"
)

func Start(ctx context.Context, c Connector, s ...Downstream) (svs Service, err error) {
	svs = &amqpService{
		ctx:         ctx,
		downStreams: s,
		amqpAddr: c.Conn,
	}

	err = svs.Run()
	return
}
