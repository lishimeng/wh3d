package main

import (
	"fmt"
	"github.com/lishimeng/app-starter/buildscript"
)

func main() {
	err := buildscript.Generate("lishimeng",
		buildscript.Application{
			Name:    "wh3d",
			AppPath: "cmd/wh3d",
			HasUI:   true,
		},
		buildscript.Application{
			Name:    "wh3d-admin",
			AppPath: "cmd/wh3d-admin",
			HasUI:   true,
		},
	)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("ok")
	}
}
