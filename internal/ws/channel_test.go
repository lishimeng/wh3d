package ws

import (
	"fmt"
	"testing"
)

/**
* @Author: Connor
* @Date:   23.8.4 16:57
* @Description:
 */

func TestName(t *testing.T) {

	//quit := make(chan struct{})
	//time3 := time.After(time.Second * 3)
	//
	//go func() {
	//	for {
	//		select {
	//		case <-time3:
	//			quit <- struct{}{}
	//		case <-time.After(time.Second * 1):
	//			t.Log("==============>")
	//			time.Sleep(time.Second)
	//		}
	//	}
	//}()
	//
	//<-quit

	var kArray = []string{"apt", "src", "fmt", "zoo", "amd", "yes"}
	fmt.Println(kArray)

	fmt.Println(rev(kArray))

	//sort.Slice(kArray, func(i, j int) bool {
	//	return kArray[i] > kArray[j]
	//})
	//fmt.Println("逆序：", kArray)
	//// 正序：
	//sort.Strings(kArray)
	//fmt.Println("正序：", kArray)

}

func rev(slice []string) []string {
	fmt.Println(slice)
	for i, j := 0, len(slice)-1; i < j; i, j = i+1, j-1 {
		slice[i], slice[j] = slice[j], slice[i]
	}
	return slice
}
