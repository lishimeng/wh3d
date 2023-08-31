package main

import (
	"context"
	"fmt"
	"github.com/beego/beego/v2/client/orm"
	"github.com/lishimeng/app-starter"
	etc2 "github.com/lishimeng/app-starter/etc"
	"github.com/lishimeng/app-starter/persistence"
	"github.com/lishimeng/go-log"
	"github.com/lishimeng/wh3d/cmd/wh3d/setup"
	"github.com/lishimeng/wh3d/internal/db"
	"github.com/lishimeng/wh3d/internal/etc"
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
	time.Sleep(time.Millisecond * 100)
}

func _main() (err error) {
	configName := "config"
	// 打开sql日志
	orm.Debug = true

	application := app.New()

	err = application.Start(func(ctx context.Context, builder *app.ApplicationBuilder) error {

		var err error
		err = builder.LoadConfig(&etc.Config, func(loader etc2.Loader) {
			loader.SetFileSearcher(configName, ".").SetEnvPrefix("").SetEnvSearcher()
		})
		if err != nil {
			return err
		}

		dbConfig := persistence.PostgresConfig{
			UserName:  etc.Config.Db.User,
			Password:  etc.Config.Db.Password,
			Host:      etc.Config.Db.Host,
			Port:      etc.Config.Db.Port,
			DbName:    etc.Config.Db.Database,
			InitDb:    true,
			AliasName: "default",
			SSL:       etc.Config.Db.Ssl,
		}

		builder.
			PrintVersion().
			EnableWeb(etc.Config.Web.Listen, setup.Route).
			EnableDatabase(dbConfig.Build(),
				db.RegisterTables()...).
			EnableStaticWeb(func() http.FileSystem {
				return http.FS(static.Static)
			}).
			ComponentAfter(setup.Setup)
		return err
	}, func(s string) {
		log.Info(s)
	})
	return
}
