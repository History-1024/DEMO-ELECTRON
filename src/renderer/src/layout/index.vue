<template>
  <el-container style="height: 100vh">
    <Aside></Aside>
    <el-container>
      <el-main style="padding: 10px">
        <el-card class="card">
          <RouterView />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './components/aside.vue'
import { RouterView } from 'vue-router'
import { setToken } from '@renderer/utils/auth'
import { refreshTokenApi } from '@renderer/api/system'
import { ipcRenderer } from 'electron'

defineOptions({
  name: 'Layout'
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
getTokenOfHttp()
ipcRenderer.on('b-msgFromMain', (e, message) => {
  console.log(message)
})
</script>

<style scoped lang="scss">
.card {
  height: 100%;
}
</style>
