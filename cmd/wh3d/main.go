package main

import (
	"context"
	"fmt"
	"github.com/lishimeng/app-starter"
	etc2 "github.com/lishimeng/app-starter/etc"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/internal/etc"
	"github.com/lishimeng/wh3d/internal/setup"
	"time"
)
import _ "github.com/lib/pq"

func main() {

	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()

	err := _main()
	if err != nil {
		fmt.Println(err)
	}
	time.Sleep(time.Second * 2)
}

func _main() (err error) {
	configName := "config"

	application := app.New()

	err = application.Start(func(ctx context.Context, builder *app.ApplicationBuilder) error {

		var err error
		err = builder.LoadConfig(&etc.Config, func(loader etc2.Loader) {
			loader.SetFileSearcher(configName, ".").SetEnvPrefix("").SetEnvSearcher()
		})
		if err != nil {
			return err
		}

		builder.
			PrintVersion().
			ComponentAfter(setup.Setup)
		return err
	}, func(s string) {
		log.Info(s)
	})
	return
}
