package static

import (
	"embed"
)

//go:embed assets/* fonts/* images/* modules/* vite.svg index.html
var Static embed.FS
