<script setup lang="ts">
defineOptions({
  name: 'Home',
})
const handleOpen = () => {
  window.ipcRenderer.send('open-win', { url: 'test', data: { name: 'msg' } })
}
</script>

<template>
  <div>HOME</div>
  <button @click="handleOpen">打开</button>
</template>

<style lang="scss" scoped></style>
