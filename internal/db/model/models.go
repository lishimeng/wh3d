package model

import "time"

type Pk struct {
	// ID
	Id int `orm:"pk;auto;column(id)"`
}

type TableChangeInfo struct {
	// 状态
	Status int `orm:"column(status)"`
	// 创建时间
	CreateTime time.Time `orm:"auto_now_add;type(datetime);column(ctime)"`
	// 修改时间
	UpdateTime time.Time `orm:"auto_now;type(datetime);column(mtime)"`
}

type TableInfo struct {
	// 创建时间
	CreateTime time.Time `orm:"auto_now_add;type(datetime);column(ctime);"`
	// 修改时间
	UpdateTime time.Time `orm:"auto_now;type(datetime);column(mtime);"`
}

type DeptOrgTableInfo struct {
	// 所属部分id
	DeptId int `orm:"column(dept_id);null"`
	// 组织ID
	OrgId int `orm:"column(org_id);null"`
}
