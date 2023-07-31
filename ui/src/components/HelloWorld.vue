<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { WorldImpl } from '../sdk/World'
import { DefaultLoadingManager } from 'three';
import { DefaultMaterials } from '../sdk/Materials';
import WhStoryBoard from './WhStoryBoard';

import LoadData from './WhDataLoader';
import { Percent } from './Util';

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

  let w = new WorldImpl()
  w.start()

  let sb = new WhStoryBoard(w.scene)
  sb.init()
  setTimeout(()=> {
    LoadData(sb)
  }, 100)

}

onMounted(() => {
  DefaultMaterials.init()
})
</script>

<template>
  <div class="gui"></div>
</template>

<style scoped>
</style>
