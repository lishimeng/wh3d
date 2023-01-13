<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { WorldImpl } from '../sdk/World'
import { DefaultLoadingManager } from 'three';
import { DefaultMaterials } from '../sdk/Materials';
import WhStoryBoard from './WhStoryBoard';

import LoadData from './WhDataLoader';
import { Percent } from './Util';

const root = ref<HTMLDivElement>()

DefaultLoadingManager.onProgress = (url, loaded, total) => {
  console.log('加载:' + url + '[' + loaded + '/' + total + ']')
  if (loaded >= total) {
    console.log('资源加载完成')
    init() // 3D入口
  }
}

let flag = false

const init = () => {
  if (flag) { // 放置某些重复执行的bug，如果不存在就可以删了
    return
  } else {
    flag = true
    initWorld()
  }
}

const initWorld =() => {
  
  let w = new WorldImpl(root.value!)
  w.start()

  let sb = new WhStoryBoard(w.scene)
  sb.init()
  setTimeout(()=> {
    LoadData(sb)
  }, 100)

  // TODO 以下为动态功能演示
  // let cur = 0, total = 60
  // let timer: number

  // setTimeout(() => {
  //   let e = sb.getStorage().stationMesh.get('2号站台')
  //   if (e == undefined) {
  //     return
  //   }
  //   e.statusWork(Percent(cur, total))
  //   timer = setInterval(() => {
  //     let n = Math.random() * 10
  //     n = Math.floor(n)
  //     cur += n
  //     e!.statusWork(Percent(cur, total))
  //     if (cur >= total) {
  //       clearInterval(timer)
  //       setTimeout(() => {
  //         e!.statusIdle()
  //       }, 20000)
  //       console.log('done')
  //     }
  //   }, 3000)
  // }, 2000)

}

onMounted(() => {
  DefaultMaterials.init()
})
</script>

<template>
  <div class="w" ref="root"></div>
  <div class="gui"></div>
</template>

<style scoped>
.w{
width: 1600px;
height: 900px;
}
</style>
