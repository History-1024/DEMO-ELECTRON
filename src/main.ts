import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import './style.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.（如果你想使用Node.js，需要在Main进程中启用' nodeintegration '。）
// import './demos/node'

const app = createApp(App)
app.use(router)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
