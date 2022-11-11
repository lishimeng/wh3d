package mq

type Connector struct {
	Conn string
}

type Downstream interface {
	Subscribe(topic string, v interface{}, upstream Upstream)
	Topic() string
}

type Upstream interface {
	Submit(topic string, v interface{}) // 提交
}

type Service interface {
	Run() error
	UpstreamHandler() Upstream
}
