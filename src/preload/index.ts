//contextBridge是一个用于在主进程和渲染进程之间创建安全通信桥梁的工具
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface WindowMessage {
  url: string
  data?: object
}
// Custom APIs for renderer
const customApi = {
  //设置全屏
  setFullScreen: () => ipcRenderer.send('set-fullScreen'),
  //创建子窗口
  createChildWindow: (data: WindowMessage) => {
    ipcRenderer.send('create-childWindow', data)
  },
  onUpdateStorage: (callback: (event: Electron.IpcRendererEvent, ...args) => void) => {
    ipcRenderer.on('update-storage', callback)
  }
}

/*
  使用' contextBridge ' api
  只在启用上下文隔离时向渲染器暴露Electron和 ElectronApi
  否则只添加到DOM全局变量中
*/

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('ElectronApi', customApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.ElectronApi = customApi
}
