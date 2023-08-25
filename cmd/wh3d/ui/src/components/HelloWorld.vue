<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted, onMounted, ref} from "vue";
import {WorldImpl} from '../sdk/World'
import {DefaultLoadingManager} from 'three';
import {DefaultMaterials} from '../sdk/Materials';
import WhStoryBoard from './WhStoryBoard';
import LoadData from './WhDataLoader';

import * as echarts from 'echarts'

const {proxy} = getCurrentInstance() as any;

import navigationBar from './navigationBar.vue'
import LoadData from './WhDataLoader';
import {Percent} from './Util';

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


function setMask() {//设置遮罩层
  var mask = document.createElement('div');

  var htmlAnchorElement = document.createElement("a");
  mask.style.position = 'fixed';
  mask.style.top = '100px';
  mask.style.left = '100px';
  htmlAnchorElement.innerHTML = "test"

  // mask.appendChild(htmlAnchorElements)
  mask.innerHTML = (`<a style="position: absolute; top: 100px;" onclick="alert('ss')">菜单一</a>`)
  mask.style.width = 100 + 'px';
  mask.style.height = window.innerHeight + 'px';
  mask.style.background = '#000';
  mask.style.opacity = '.1';
  mask.style.position = 'fixed';
  mask.style.top = '0';
  mask.style.left = '0';
  mask.style.zIndex = 10086;
  document.body.appendChild(mask);
}

</script>

<template>
  <div class="gui"></div>
  <!--  导航栏组件-->
  <navigationBar/>
</template>

<style scoped>
</style>
