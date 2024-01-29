import { BrowserWindow, ipcMain } from 'electron'
let childWindow
export function createChildWindow(ipcMainInstance: typeof ipcMain, parentWindow: BrowserWindow) {
  // 监听渲染进程发送的 create-childWindow 消息
  ipcMainInstance.on('create-childWindow', (_, data) => {
    const appURL = 'http://localhost:5173/'
    try {
      if (childWindow) return
      childWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
          // webSecurity: false
        },
        parent: parentWindow, // 设置子窗口的父窗口为主窗口
        // alwaysOnTop: true,

        title: data.url
      })

      childWindow.maximize()
      childWindow.menuBarVisible = false
      //用于决定窗口是否可被用户手动最小化
      childWindow.minimizable = false
      //用于决定窗口是否可被用户手动调整大小
      childWindow.resizable = false
      // 加载指定 URL 到子窗口
      childWindow.loadURL(appURL + data.url)

      // 在子窗口关闭时触发的事件
      childWindow.on('closed', () => {
        childWindow = null
      })
      return childWindow
    } catch (error) {
      console.log('error: ', error)
    }
  })
}
ipcMain.on('a-sendMsgMain', (_, msg) => {
  childWindow.webContents.send('b-msgFromMain', msg) // childWin为B窗口
})
