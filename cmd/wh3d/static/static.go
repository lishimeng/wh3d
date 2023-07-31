package static

import (
	"embed"
)

//go:embed * assets/* fonts/* fonts/*/* images/* images/*/* modules/* modules/*/*
var Static embed.FS
