package static

import (
	"embed"
)

//go:embed * fonts/* fonts/*/* images/* images/*/* modules/* modules/*/*
var Static embed.FS
