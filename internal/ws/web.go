package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/lishimeng/app-starter"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/internal/db/view"
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

func Te(_ context.Context) (err error) {
	// 新建一个定时任务对象
	//// 根据cron表达式进行时间调度，cron可以精确到秒，大部分表达式格式也是从秒开始。
	////crontab := cron.New()  默认从分开始进行时间调度
	//crontab := cron.New(cron.WithSeconds()) //精确到秒
	////定义定时器调用的任务函数
	//task := func() {
	//	fmt.Println("hello world", time.Now())
	//}
	////定时任务
	//spec := "*/5 * * * * ?" //cron表达式，每五秒一次
	//// 添加定时任务,
	//crontab.AddFunc(spec, task)
	//// 启动定时器
	//crontab.Start()

	time.Sleep(5 * time.Second)

	room := "A511"
	//total := 30
	//ch := make(chan testData)
	instackNos := make([]string, 0)

	instackNos = append(instackNos, "030100041942",
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
		"030100041198",
		"030100041230",
		"030100041211",
		"030100041209",
		"030100041207",
		"030100041212",
		"030100041215",
		"030100041214",
		"030100041201",
		"030100041204",
		"030100041200")

	for i, no := range instackNos {
		marshal, err := json.Marshal(testData{
			StationNo:   "No.2[IN]",
			CurrNum:     i + 1,
			TotalNum:    30,
			StationType: 1,
			ContainerNo: no,
			PosX:        1,
			PosY:        1,
			PosZ:        1})
		if err != nil {
			fmt.Println(err)
		}
		fmt.Printf("===============> %s\n", marshal)
		Broadcast(room, string(marshal))
		time.Sleep(time.Second)
	}

	revDatas := make([]view.InventoryContainerItemInfoView, 0)
	_, err = app.GetOrm().Context.Raw(`select * from inventory_container_item_info_view 
where area = 'PX01'
and pos_x >=0
order by pos_x ,pos_y ,pos_z`).QueryRows(&revDatas)
	if err != nil {
		return err
	}

	// 入库操作
	//revInstackNos := rev(instackNos)

	for i, no := range revDatas {
		marshal, err := json.Marshal(testData{
			StationNo:   "No.2[IN]",
			CurrNum:     i + 1,
			TotalNum:    30,
			StationType: 2, // 入库
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
		Broadcast(room, string(marshal))
		time.Sleep(time.Second)
	}

	//for c := 0; c < total; c++ {
	//
	//	go func(child int) {
	//		// 向ch 信道发送信息
	//		ch <- datas[child]
	//		time.Sleep(time.Second)
	//	}(c)
	//}
	//// 遍历缓存数，接受所有信道的中数据
	//for total > 0 {
	//	// 从ch 信道中获取数据，没有数据则阻塞等待
	//	c := <-ch
	//	// 缓存数递减
	//	total--
	//	marshal, err := json.Marshal(c)
	//	if err != nil {
	//		fmt.Println(err)
	//	}
	//	fmt.Printf("===============> %s\n", marshal)
	//	Broadcast(room, string(marshal))
	//}

	return err

	//time5 := time.After(time.Second * 5)
	//quit := make(chan struct{})
	//
	//go func() {
	//	for {
	//		select {
	//		case <-time5:
	//			quit <- struct{}{}
	//		case <-time.After(time.Second * 1):
	//			marshal, err := json.Marshal(data)
	//			if err != nil {
	//				fmt.Println(err)
	//			}
	//			fmt.Printf("===============> %s\n", marshal)
	//			Broadcast(room, string(marshal))
	//			data.CurrNum++
	//		}
	//	}
	//}()
	//<-quit
	//fmt.Printf("done...")
	//return nil
}

type testData struct {
	StationNo   string `json:"stationNo"`
	CurrNum     int    `json:"currNum"`
	TotalNum    int    `json:"totalNum"`
	StationType int    `json:"stationType"`
	ContainerNo string `json:"containerNo"`
	PosX        int    `json:"posX"`
	PosY        int    `json:"posY"`
	PosZ        int    `json:"posZ"`
}

func rev(slice []string) []string {
	fmt.Println(slice)
	for i, j := 0, len(slice)-1; i < j; i, j = i+1, j-1 {
		slice[i], slice[j] = slice[j], slice[i]
	}
	return slice
}
