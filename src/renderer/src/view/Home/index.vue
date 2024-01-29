<script setup lang="ts">
import { refreshTokenApi } from '@renderer/api/system'
import { getToken, setToken } from '@renderer/utils/auth'
import { ipcRenderer } from 'electron'
defineOptions({
  name: 'Home'
})
const getTokenOfHttp = async () => {
  try {
    const res = await refreshTokenApi()
    //获取当前时间
    const currentDate = new Date()
    //增加 后端返回的秒数
    const resultTimestamp = currentDate.setSeconds(currentDate.getSeconds() + res.data.expires_in)
    res.data.expires = new Date(resultTimestamp)
    setToken(res.data)
  } catch (error) {
    console.log('error: ', error)
  }
}
ipcRenderer.send('a-sendMsgMain', '123')
getTokenOfHttp()

const openWindow = () => {
  localStorage.setItem('routerType', 'Desc')
  window.ElectronApi.createChildWindow({ url: 'Disease', data: { name: '子窗口' } })
}
const doGet = () => {
  getToken()
}
const send = async () => {
  // const res = await doGetTest()
}
</script>

<template>
  <div class="container">
    <div class="left item"></div>
    <div class="center item">
      <div class="center-top">北京三岭科技</div>
      <div class="center-bottom">
        <el-button type="primary" @click="openWindow">打开窗口</el-button>
        <el-button type="primary" @click="doGet">获取token</el-button>
        <el-button type="primary" @click="send">发送请求</el-button>
      </div>
    </div>
    <div class="right item"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  .item {
    height: 100%;
    border: 1px solid #003eb3;
  }
  .left {
    width: 25%;
  }
  .center {
    width: 49.5%;
    .center-top {
      height: 100px;
      font-size: 30px;
      text-align: center;
      border-bottom: 1px solid #003eb3;
      color: var(--el-text-color-primary);
      padding: 5px 8px;
    }
  }
  .right {
    width: 25%;
  }
}
</style>
