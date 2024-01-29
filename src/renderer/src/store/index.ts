import type { App } from 'vue'
import { createPinia } from 'pinia'
const store = createPinia()
// 设置 Pinia 实例到应用程序
export function setupStore(app: App<Element>) {
  app.use(store)
}
export { store }
