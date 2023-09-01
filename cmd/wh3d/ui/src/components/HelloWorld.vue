<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted} from "vue";
import {WorldImpl} from '../sdk/World'
import {DefaultLoadingManager} from 'three';
import {DefaultMaterials} from '../sdk/Materials';
import WhStoryBoard from './WhStoryBoard';
import LoadData from './WhDataLoader';

// import * as echarts from 'echarts'

const {proxy} = getCurrentInstance() as any;

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

const initWorld = () => {

  let w = new WorldImpl()
  w.start()

  let sb = new WhStoryBoard(w.scene)
  sb.init()
  setTimeout(() => {
    LoadData(sb)
  }, 100)

}

onMounted(() => {
  DefaultMaterials.init()
  // setMask()
})


</script>

<template>
  <div class="gui"></div>
  <!--  导航栏组件-->
  <!--  <navigationBar/>-->

</template>

<style scoped>
</style>
