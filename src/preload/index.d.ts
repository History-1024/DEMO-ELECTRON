import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    ElectronApi: APIType
  }
  interface WindowMessage {
    url: string
    data?: object
  }
  interface APIType {
    setFullScreen(): void
    createChildWindow(data: WindowMessage): void
    onUpdateStorage(callback: (event: Electron.IpcRendererEvent, ...args) => void): void
  }
}
