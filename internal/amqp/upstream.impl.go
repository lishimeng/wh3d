package mq

import (
	"encoding/json"
	"github.com/streadway/amqp"
	"log"
)

type AmqpUpstream struct {
	ch *amqp.Channel
	exchange string
}

func (au *AmqpUpstream) Submit(topic string, v interface{}) {
	log.Printf("submit to %s\n", topic)
	bs, err := json.Marshal(v)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("submit:" + string(bs))
	err = au.ch.Publish(au.exchange, topic, false, false, amqp.Publishing{
		ContentType:     "application/json",
		Body:            bs,
	})
	if err != nil {
		log.Println("submit failed")
		log.Println(err)
		return
	}
	log.Println("submit completed")
}
