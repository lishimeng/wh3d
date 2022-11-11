package etc

type Configuration struct {
	Web web `toml:"web"`
	Mq  mq  `toml:"mq"`
}

type web struct {
	Listen string `toml:"listen"`
}

type mq struct {
	Conn      string `toml:"conn"`
	Subscribe string `toml:"subscribe"`
}
