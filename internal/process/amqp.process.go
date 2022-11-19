package process

import (
	"context"
	"encoding/json"
	"github.com/lishimeng/go-log"
	mq "github.com/lishimeng/wh3d/internal/amqp"
	"github.com/lishimeng/wh3d/internal/etc"
	"github.com/lishimeng/wh3d/internal/ws"
)

var _ mq.Service

type Ds struct {
}

type WhMessage struct {
	Bu      string `json:"bu,omitempty"`      // 大屏所属部门：A511，A610
	Payload string `json:"payload,omitempty"` // 消息内容
}

func (ds *Ds) Subscribe(_ string, v interface{}, _ mq.Upstream) {

	var err error
	//log.Debug("receive data: app:%s. device:%s[%s:%s]", message.AppID, message.DeviceID, message.DeviceName, message.DeviceCode)
	bs := v.([]byte)
	var m WhMessage
	err = json.Unmarshal(bs, &m)
	if err != nil {
		log.Info(err)
		return
	}
	ws.Broadcast(m.Bu, m.Payload)
}

func (ds *Ds) Topic() string {
	return etc.Config.Mq.Subscribe.WhEvent
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
