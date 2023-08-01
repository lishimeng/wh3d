package common

import (
	"github.com/kataras/iris/v12"
	"github.com/lishimeng/app-starter"
	"math"
	"time"
)

// 相应状态码
const (
	RespCodeSuccess     = 200
	RespCodeNotFound    = 404
	RespCodeServerError = 500
	RespCodeError       = 400
)

const (
	DefaultPageSize = 10
	DefaultPageNo   = 1
)

// 响应信息
const (
	RespMsgNotFount      = "not found"
	RespMsgIdNum         = "id must be a int value"
	RespSuccessMsg       = "success"
	RespFailMsg          = "fail"
	RespNotDataFoundById = "Data was not found with id"
)

// 异常消息
const (
	LocationExistsError   = "此库位已存在"
	InvalidParameterError = "无效参数"
	RespCodeErrorMsg      = "错误请求"
)

// 默认状态
const (
	DefaultStatus  = 10
	DisabledStatus = 20
)

const (
	// DefaultTimeFormatter 默认接口传递日期字符串，后台接口自动解析为commons.Time 类型，此日期格式不更改
	DefaultTimeFormatter = "2006-01-02 15:04:05"
)

type Time time.Time

const (
	timeFormat        = "2006-01-02 15:04:05"
	TimeFormatInvalid = "0001-01-01 00:00:00"
)

func (t *Time) UnmarshalJSON(data []byte) (err error) {
	// 判断时间是否合法
	if len(data) > 0 && len(string(data)) <= 5 {
		*t = Time{}
		return
	}
	now, err := time.ParseInLocation(`"`+timeFormat+`"`, string(data), time.Local)
	*t = Time(now)
	return
}

func (t Time) MarshalJSON() ([]byte, error) {
	b := make([]byte, 0, len(timeFormat)+2)
	b = append(b, '"')
	b = time.Time(t).AppendFormat(b, timeFormat)
	b = append(b, '"')
	return b, nil
}

func (t Time) String() string {
	return time.Time(t).Format(timeFormat)
}
func ResponseJSON(ctx iris.Context, j interface{}) {
	_ = ctx.JSON(j)
}

func CalcPageOffset(p *app.Pager) int {
	return (p.PageNum - 1) * p.PageSize
}

func CalcTotalPage(p *app.Pager, count int64) int {
	t := math.Ceil(float64(count) / float64(p.PageSize))
	return int(t)
}

func FormatTime(t time.Time) (s string) {
	s = t.Format(DefaultTimeFormatter)
	if s == TimeFormatInvalid {
		return ""
	}
	return
}

// TPFunDateTimeStringFormat 时间格式化    时间格式化字符串，使用本地时区格式+8
func DateTimeTimeFormat(timeValue time.Time) string {
	if !timeValue.IsZero() {
		chinaLocal, _ := time.LoadLocation("Local")
		s := timeValue.In(chinaLocal).Format(DefaultTimeFormatter) //使用模板格式化为日期字符串
		if s == TimeFormatInvalid {
			return ""
		}
		return s
	}
	return ""
}

// 自定义格式
func DateTimeTimeFormatWithFormatter(timeValue time.Time, formatter string) string {
	if !timeValue.IsZero() {
		chinaLocal, _ := time.LoadLocation("Local")
		s := timeValue.In(chinaLocal).Format(formatter) //使用模板格式化为日期字符串
		if s == TimeFormatInvalid {
			return ""
		}
		return s
	}
	return ""
}

func ParseTimeByStr(timeStr string) time.Time {
	chinaLocal, _ := time.LoadLocation("Local")
	formatTime, err := time.ParseInLocation(timeFormat, timeStr, chinaLocal)

	if err != nil {
		return time.Time{}
	}
	return formatTime
}

func FormatTimeByPattern(t time.Time, pattern string) (s string) {
	s = t.Format(pattern)
	return
}
