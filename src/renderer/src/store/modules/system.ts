import { defineStore } from 'pinia'
import { store } from '@renderer/store'
import { appType } from './types'
import { RefreshTokenResult, refreshTokenApi } from '@renderer/api/system'
import { setToken } from '@renderer/utils/auth'
export const useApp = defineStore({
  id: 'sanLing-app',
  state: (): appType => ({
    routerType: '',
    themeMode: 'default'
  }),
  getters: {
    getRouterType(state) {
      return state.routerType
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      //检查对象是否具有指定属性
      if (Reflect.has(this, key)) {
        this[key] = value
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data)
    },
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then((res) => {
            if (res) {
              setToken(res.data)
              resolve(res)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
export function useAppHook() {
  return useApp(store)
}
