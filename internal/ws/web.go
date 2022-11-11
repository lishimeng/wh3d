package ws

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/internal/etc"
	"github.com/lishimeng/wh3d/static"
	"net/http"
	"time"
)

func subscribe(w http.ResponseWriter, r *http.Request) {
	var id = fmt.Sprintf("c%d", time.Now().Nanosecond())
	var roomName = "" // TODO
	if !websocket.IsWebSocketUpgrade(r) {
		return
	}

	log.Info("id: %s", id)
	// 完成和Client HTTP >>> WebSocket的协议升级
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Info("upgrade:", err)
		return
	}
	defer func() {
		leaveRoom(roomName, id)
		_ = c.Close()
	}()

	joinRoom(roomName, id, c)

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Info("read:", err)
			break
		}
		log.Info("recv: %s", message)
	}
}

func Web() {
	log.Info("app start")
	mux := http.NewServeMux()
	mux.HandleFunc("/subscribe", subscribe)
	mux.Handle("/", http.FileServer(http.FS(static.Static)))
	log.Info(http.ListenAndServe(etc.Config.Web.Listen, mux))
}
