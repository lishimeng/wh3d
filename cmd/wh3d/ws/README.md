WebSocket消息订阅
---
架构
---
room --> client

房间用来给消息分组，保证消息来自订阅源头

消息的发布采用广播模式，广播的范围限定在Room(仓库部门)

---
join room: 进入房间

---
leave room: 从房间离开

---