#!/bin/bash
targetDir="build"
appName="wh3d"
GOOS=linux GOPROXY=https://goproxy.io GOARCH=amd64 go build -o "${targetDir}/${appName}" cmd/${appName}/main.go
echo "done"
sleep 10
