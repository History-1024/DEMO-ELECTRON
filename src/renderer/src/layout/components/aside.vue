<script setup lang="ts">
import Menu from './menu.vue'
defineOptions({
  name: ''
})
</script>

<template>
  <el-aside width="200px">
    <Menu></Menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  color: var(--el-text-color-primary);
}
.el-menu {
  border-right: none;
}
</style>
