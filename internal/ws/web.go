package ws

import (
	"context"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/internal/etc"
	"net/http"
	"time"
)

func subscribe(w http.ResponseWriter, r *http.Request) {

	var id = fmt.Sprintf("c%d", time.Now().Nanosecond())
	var roomName = "" // 每个组织一个Room
	q := r.URL.Query()
	if values, ok := q["id"]; ok {
		roomName = values[0] // 此处是区分每个组织
	} else {
		log.Info("unknown room")
		return
	}

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

func Web(_ context.Context) (err error) {
	go func() {
		log.Info("websocket start")
		mux := http.NewServeMux()
		mux.HandleFunc("/subscribe", subscribe)
		//mux.Handle("/", http.FileServer(http.FS(static.Static)))
		log.Info(http.ListenAndServe(etc.Config.Web.Listen, mux))
	}()

	return
}
