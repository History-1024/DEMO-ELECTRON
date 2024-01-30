window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[接受主线程消息]:', ...args)
})
window.ipcRenderer.on('updateData', (_event, ...args) => {
  console.log('[更新参数]', ...args)
})
