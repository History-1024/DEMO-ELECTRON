import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// 导入 createChildWindow 函数
import { createChildWindow } from './createChildren'

// 创建窗口函数
function createWindow(): void {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 当窗口准备就绪时显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 设置窗口打开处理程序，用于在默认浏览器中打开外部链接
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.openDevTools()
  // HMR（热模块替换）用于 Electron-Vite CLI 的渲染器。
  // 根据开发环境加载远程 URL 或生产环境中的本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 在 createWindow 中调用 createChildWindow
  createChildWindow(ipcMain, mainWindow)
}

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 在此事件发生后才能使用某些 API。
app.whenReady().then(() => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 默认通过 F12 打开或关闭开发工具（仅在开发环境中），
  // 并在生产环境中忽略 CommandOrControl + R。
  // 详情请参见 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 创建窗口
  createWindow()

  // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
  // 重新创建一个窗口是常见的。
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出应用程序，但在 macOS 上例外。
// 在 macOS 上，通常应用程序和其菜单栏保持活动状态，直到用户使用 Cmd + Q 显式退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在此文件中，您可以包含应用程序特定的主进程代码。
// 您还可以将它们放在单独的文件中，并在此处引入它们。
