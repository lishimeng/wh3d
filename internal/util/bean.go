package util

import (
	"errors"
	"fmt"
	"reflect"
)

// 判断基本类型值是否有效
func isBlank(value reflect.Value) bool {
	//fmt.Println(value.Kind())
	switch value.Kind() {
	case reflect.String:
		return value.Len() == 0
	case reflect.Bool:
		// Bug 当value的值就是false时，逻辑默认判断!，会导致跳过该属性值拷贝
		return !value.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return value.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return value.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return value.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return value.IsNil()
	}
	return reflect.DeepEqual(value.Interface(), reflect.Zero(value.Type()).Interface())
}

// SimpleCopyProperties2 复制属性 version 2
func SimpleCopyProperties2(src, dst interface{}) (err error) {
	// 防止意外panic
	defer func() {
		if e := recover(); e != nil {
			err = errors.New(fmt.Sprintf("%v", e))
		}
	}()

	dstType, dstValue := reflect.TypeOf(dst), reflect.ValueOf(dst)
	srcType, srcValue := reflect.TypeOf(src), reflect.ValueOf(src)

	// dst必须结构体指针类型
	if dstType.Kind() != reflect.Ptr || dstType.Elem().Kind() != reflect.Struct {
		return errors.New("dst type should be a struct pointer")
	}

	// src必须为结构体或者结构体指针
	if srcType.Kind() == reflect.Ptr {
		srcType, srcValue = srcType.Elem(), srcValue.Elem()
	}
	if srcType.Kind() != reflect.Struct {
		return errors.New("src type should be a struct or a struct pointer")
	}

	// 取具体内容
	dstType, dstValue = dstType.Elem(), dstValue.Elem()

	// dst属性个数 8
	propertyNums := dstType.NumField()
	// 计数器，当前dst全部遍历完以后直接退出循环
	propertyNumsCount := 0

	// src属性个数 >= 8
	propertyNumsSrc := srcType.NumField()

	// 遍历src
	for i := 0; i < propertyNumsSrc; i++ {
		// 说明dst的所有值都替换完毕，退出
		if propertyNumsCount == propertyNums {
			break
		}
		propertySrc := srcType.Field(i)
		srcType := propertySrc.Type.String()
		srcName := propertySrc.Name

		// 待填充属性值
		propertyValue := srcValue.FieldByName(propertySrc.Name)

		// 遍历 dest
		for j := 0; j < propertyNums; j++ {
			propertyDst := dstType.Field(j)
			dstType := propertyDst.Type.String()
			dstName := propertyDst.Name

			if srcType == dstType && srcName == dstName && !isBlank(propertyValue) {
				// 设置值到 dest
				if dstValue.Field(j).CanSet() {
					dstValue.Field(j).Set(propertyValue)
					propertyNumsCount++
					break
				}
			}

			// 当前类型不一致，属性名一致（time.Time，b）
			//if srcType != dstType && srcName == dstName && !isBlank(propertyValue) {
			//	if srcType == "time.Time" {
			//		// 日期处理========》 将 model.结构体种的time.Time日期类型拷贝到 自定义json结构体的 string 类型字段中
			//		proVal := propertyValue.Interface().(time.Time)
			//		formatTime := DateTimeTimeFormat(proVal)
			//		of := reflect.ValueOf(formatTime)
			//		dstValue.Field(j).Set(of)
			//	} else if srcType == "commons.Time" && dstType == "time.Time" {
			//		// 日期处理========》将json结构体中的 自定义日期类型 commons.Time 转换为 time.Time类型拷贝到 model.结构体中
			//		// 获取当前属性值
			//		proVal := propertyValue.Interface().(Time)
			//		// 将当前属性值、解析time.Time类型
			//		timeVal := ParseTimeByStr(proVal.String())
			//		// 通过反射获取当前属性 Value
			//		tValue := reflect.ValueOf(timeVal)
			//		// 通过反射设置到目标对应的属性种
			//		dstValue.Field(j).Set(tValue)
			//	}
			//	break
			//}

			// boolean类型处理为 false 的情况 =========》
			if srcType == "bool" && dstType == "bool" && srcName == dstName && isBlank(propertyValue) {
				dstValue.Field(j).Set(propertyValue)
				break
			}
		}
	}
	return nil
}
