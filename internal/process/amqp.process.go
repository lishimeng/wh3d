package process

import (
	"context"
	"github.com/lishimeng/go-log"
	mq "github.com/lishimeng/wh3d/internal/amqp"
	"github.com/lishimeng/wh3d/internal/etc"
)

var _ mq.Service

type Ds struct {
}

func (ds *Ds) Subscribe(_ string, v interface{}, _ mq.Upstream) {

	//log.Debug("receive data: app:%s. device:%s[%s:%s]", message.AppID, message.DeviceID, message.DeviceName, message.DeviceCode)

}

func (ds *Ds) Topic() string {
	return etc.Config.Mq.Subscribe
}

func AmqpStart(ctx context.Context) (err error) {

	log.Info("Start uplink(device data) listener")
	ds := Ds{}
	_, err = mq.Start(ctx, mq.Connector{Conn: etc.Config.Mq.Conn}, &ds)
	if err != nil {
		log.Info("Amqp start err ")
		log.Info(err)
		return
	}

	return
}
