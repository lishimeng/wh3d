package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/internal/db/view"
	"time"
)

func Subscribe(ctx iris.Context) {

	var id = fmt.Sprintf("c%d", time.Now().Nanosecond())
	var roomName = "" // 每个组织一个Room
	roomName = ctx.URLParam("id")

	if len(roomName) <= 0 {
		log.Info("unknown room")
		return
	}

	if !websocket.IsWebSocketUpgrade(ctx.Request()) {
		return
	}

	log.Info("id: %s", id)
	// 完成和Client HTTP >>> WebSocket的协议升级
	c, err := upgrader.Upgrade(ctx.ResponseWriter(), ctx.Request(), nil)
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

func Te(_ context.Context) (err error) {
	time.Sleep(5 * time.Second)

	room := "A511"
	instackNos := make([]string, 0)

	instackNos = append(instackNos, "030100041200",
		"030100041942",
		"030100014441",
		"030100041249",
		"030100041244",
		"030100041250",
		"030100041240",
		"030100041247",
		"030100041242",
		"030100041248",
		"030100041238",
		"030100041245",
		"030100041227",
		"030100041226",
		"030100041234",
		"030100041222",
		"030100041224",
		"030100041231",
		"030100041217",
		"030100041229",
		"030100041230",
		"030100041211",
		"030100041209",
		"030100041207",
		"030100041212",
		"030100041215",
		"030100041214",
		"030100041201",
		"030100041204",
		"030100041198")

	for i, no := range instackNos {
		marshal, err := json.Marshal(eventData{
			StationNo:   "No.2[IN]",
			CurrNum:     i + 1,
			TotalNum:    30,
			ContainerNo: no})
		if err != nil {
			fmt.Println(err)
		}
		fmt.Printf("===============> %s\n", marshal)

		wsData := wsEventData{
			EventType: "10",
			Payload:   string(marshal),
		}

		bytes, err := json.Marshal(wsData)
		if err != nil {
			return err
		}

		Broadcast(room, string(bytes))
		time.Sleep(time.Second)
	}
	revDatas := make([]view.InventoryContainerItemInfoView, 0)
	if _, err = app.GetOrm().Context.Raw(`select * from inventory_container_item_info_view
	where area = 'PX01'
	and pos_x >=0
	order by pos_x ,pos_y ,pos_z`).QueryRows(&revDatas); err != nil {
		return err
	}

	// 入库操作
	for i, no := range revDatas {
		marshal, err := json.Marshal(eventData{
			StationNo:   "No.2[IN]",
			CurrNum:     i + 1,
			TotalNum:    30,
			ContainerNo: no.ContainerNo,
			PosX:        no.PosX,
			PosY:        no.PosY,
			PosZ:        no.PosZ,
		},
		)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Printf("===============> %s\n", marshal)
		// 发送消息到 前端ws

		wsData := wsEventData{
			EventType: "20",
			Payload:   string(marshal),
		}

		bytes, err := json.Marshal(wsData)
		Broadcast(room, string(bytes))
		time.Sleep(time.Second)
	}
	return err
}

// 发送前台ws json数据
type wsEventData struct {
	EventType string `json:"eventType"`
	Payload   string `json:"payload"`
}

// 托盘、库位数据
type eventData struct {
	StationNo   string `json:"stationNo"`
	CurrNum     int    `json:"currNum"`
	TotalNum    int    `json:"totalNum"`
	ContainerNo string `json:"containerNo"`
	PosX        int    `json:"posX"`
	PosY        int    `json:"posY"`
	PosZ        int    `json:"posZ"`
}

// 数组反转
func rev(slice []string) []string {
	fmt.Println(slice)
	for i, j := 0, len(slice)-1; i < j; i, j = i+1, j-1 {
		slice[i], slice[j] = slice[j], slice[i]
	}
	return slice
}
