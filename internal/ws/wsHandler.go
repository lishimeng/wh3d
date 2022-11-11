package ws

import (
	"github.com/gorilla/websocket"
	"github.com/lishimeng/go-log"
	"net/http"
	"time"
)

var room = make(map[string]map[string]*websocket.Conn)

func joinRoom(roomName string, id string, conn *websocket.Conn) {

	if _, ok := room[roomName]; !ok {
		log.Info("create room:%s", roomName)
		room[roomName] = make(map[string]*websocket.Conn)
	}
	log.Info("join room:%s", id)
	room[roomName][id] = conn
}

func leaveRoom(roomName, id string) {
	log.Info("leave from room:%s[%s]", id, roomName)
	if r, ok := room[roomName]; ok {
		delete(r, id)
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
	HandshakeTimeout: 5 * time.Second,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Broadcast(roomName string, payload string) {

	defer func() {
		if e := recover(); e != nil {
			log.Info(e)
		}
	}()

	if r, ok := room[roomName]; ok {
		for id, conn := range r {
			broadcastToClient(roomName, id, payload, conn)
		}
	} else {
		log.Info("unknown room: %s", roomName)
	}
}

func broadcastToClient(roomName string, id string, payload string, conn *websocket.Conn) {
	defer func() {
		if e := recover(); e != nil {
			log.Info(e)
		}
	}()
	log.Info("broadcast to: %s[%s]:%s", id, roomName, payload)
	_ = conn.WriteMessage(websocket.TextMessage, []byte(payload))
}