<template>
  <el-scrollbar>
    <el-menu :default-openeds="['/Disease']" @select="handleSelect">
      <div v-for="routeItem in RouterList" :key="routeItem.path">
        <el-sub-menu v-if="routeItem.children?.length > 0" :index="routeItem.path">
          <template #title>
            <div :class="currentRouterPath === routeItem.path ? 'selectedMenu' : ''">
              <el-icon v-if="routeItem.meta.icon">
                <component :is="routeItem.meta.icon"></component>
              </el-icon>
              {{ routeItem.meta?.title }}
            </div>
          </template>
          <el-menu-item
            v-for="child in routeItem.children"
            :key="child.path"
            :index="child.path"
            :class="currentRouterPath === child.path ? 'selectedMenu' : ''"
            >{{ child.meta?.title }}</el-menu-item
          >
        </el-sub-menu>
        <el-menu-item
          v-else
          :index="routeItem.path"
          :class="currentRouterPath === routeItem.path ? 'selectedMenu' : ''"
          ><el-icon v-if="routeItem.meta.icon">
            <component :is="routeItem.meta.icon"></component> </el-icon
          >{{ routeItem.meta?.title }}</el-menu-item
        >
      </div>
    </el-menu>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute, Router, RouteRecordRaw } from 'vue-router'

defineOptions({
  name: 'MenuItem'
})

const router: Router = useRouter()
const currentRoute = useRoute()
//Router列表
const RouterList = ref([] as RouteRecordRaw[])

onMounted(() => {
  getRouters()
})
//获取菜单
const getRouters = () => {
  const currentRouterList = router.getRoutes().filter((router) => {
    return router.name === localStorage.getItem('routerType')
  })
  RouterList.value = currentRouterList[0]?.children || []
}
//点击菜单
const handleSelect = (path: string) => {
  router.push(path)
}
//获取当前route.path
const currentRouterPath = computed(() => {
  return currentRoute.path
})
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}
.selectedMenu {
  background-color: #1677ff;
  border-radius: 3px;
  color: var(--el-text-color-primary);
}
</style>
