<template>
  <div class="parentBox">
    <div class="navBox">
      <p>菜单</p>
      <ul class="menuBox">
        <li><span class="contnatBox">选项1</span></li>
        <li><span class="contnatBox">选项2</span></li>
        <li><span class="contnatBox">选项3</span></li>
        <li><span class="contnatBox">选项4</span></li>
        <li><span class="contnatBox">选项5</span></li>
        <li><span class="contnatBox">选项6</span></li>
        <li><span class="contnatBox">选项7</span></li>
        <li><span class="contnatBox">选项8</span></li>
        <li><span class="contnatBox">选项9</span></li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
.parentBox {
  position: absolute;
  top: 0;
  left: 100px;
  width: 300px;
  height: 15%;
  //background-color: transparent;
  //background: #74777b;
  padding: 100px 0;
  transform: translate3d(0, 0, 0);

  *:after,
  *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  span {
    color: rgba(255, 255, 255, 0.6);
    outline: none;
    text-decoration: none;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }

  span:hover,
  span:focus {
    cursor: pointer;
    color: #74777b;
    text-decoration: none;
  }

  .navBox {
    width: 150px;
    height: 150px;
    line-height: 150px;
    border-radius: 50%;
    background: #fff;
    margin: 30px auto;
    position: relative;
    cursor: pointer;
    text-align: center;
    font-size: 1.75em;
    font-weight: bold;
    color: cornflowerblue;
    transition: 0.24s 0.2s;

    .menuBox {
      list-style: none;
      padding: 0;
      margin: 0;
      position: absolute;
      top: -75px;
      left: -75px;
      border: 150px solid transparent;
      cursor: default;
      border-radius: 50%;
      transform: scale(0);
      transition: transform 1.4s 0.07s;
      z-index: -1;
    }

    .menuBox li {
      position: absolute;
      top: -100px;
      left: -100px;
      transform-origin: 100px 100px;
      transition: all 0.5s 0.1s;
    }

    .menuBox li span {
      width: 45px;
      height: 45px;
      line-height: 45px;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      font-size: 60%;
      color: cornflowerblue;
      transition: 0.6s;
    }

    .menuBox li span:hover {
      background: rgba(255, 255, 255, 0.7);
    }
  }

  .navBox:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  .navBox:hover .menuBox {
    transition: transform 0.4s 0.08s, z-index 0s 0.5s;
    transform: scale(1.2);
    z-index: 1;
  }

  .navBox:hover .menuBox li {
    transition: all 0.6s;
  }

  .navBox:hover .menuBox li:nth-child(1) {
    transition-delay: 0.02s;
    transform: rotate(85deg);
  }

  .navBox:hover .menuBox li:nth-child(1) span {
    transition-delay: 0.04s;
    transform: rotate(635deg);
  }

  .navBox:hover .menuBox li:nth-child(2) {
    transition-delay: 0.04s;
    transform: rotate(125deg);
  }

  .navBox:hover .menuBox li:nth-child(2) span {
    transition-delay: 0.08s;
    transform: rotate(595deg);
  }

  .navBox:hover .menuBox li:nth-child(3) {
    transition-delay: 0.06s;
    transform: rotate(165deg);
  }

  .navBox:hover .menuBox li:nth-child(3) span {
    transition-delay: 0.12s;
    transform: rotate(555deg);
  }

  .navBox:hover .menuBox li:nth-child(4) {
    transition-delay: 0.08s;
    transform: rotate(205deg);
  }

  .navBox:hover .menuBox li:nth-child(4) span {
    transition-delay: 0.16s;
    transform: rotate(515deg);
  }

  .navBox:hover .menuBox li:nth-child(5) {
    transition-delay: 0.1s;
    transform: rotate(245deg);
  }

  .navBox:hover .menuBox li:nth-child(5) span {
    transition-delay: 0.2s;
    transform: rotate(475deg);
  }

  .navBox:hover .menuBox li:nth-child(6) {
    transition-delay: 0.12s;
    transform: rotate(285deg);
  }

  .navBox:hover .menuBox li:nth-child(6) span {
    transition-delay: 0.24s;
    transform: rotate(435deg);
  }

  .navBox:hover .menuBox li:nth-child(7) {
    transition-delay: 0.14s;
    transform: rotate(325deg);
  }

  .navBox:hover .menuBox li:nth-child(7) span {
    transition-delay: 0.28s;
    transform: rotate(395deg);
  }

  .navBox:hover .menuBox li:nth-child(8) {
    transition-delay: 0.16s;
    transform: rotate(365deg);
  }

  .navBox:hover .menuBox li:nth-child(8) span {
    transition-delay: 0.32s;
    transform: rotate(355deg);
  }

  .navBox:hover .menuBox li:nth-child(9) {
    transition-delay: 0.18s;
    transform: rotate(405deg);
  }

  .navBox:hover .menuBox li:nth-child(9) span {
    transition-delay: 0.36s;
    transform: rotate(315deg);
  }
}
</style>
