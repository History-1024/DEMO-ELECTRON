import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@renderer/store'
import router from '@renderer/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style/reset.scss'

import { ElMessage } from 'element-plus' //引入message组件

const app = createApp(App)

app.config.globalProperties.$message = ElMessage //挂载到app实例上
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
setupStore(app)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
