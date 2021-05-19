const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')


const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }

  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)



require('update-electron-app')({ repo: "schiarolla/tool", updateInterval: "1 hour" })

function createWindow() {
  const mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true, contextIsolation: false }, title: 'Toolbox' })
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`)
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/*

// removes a specific listener from a specified channel
removeListener(channel,listener)
// removes all listeners from a channel
removeAllListeners([channel])

///// async
// main process(main.js)
const { ipcMain } = require('electron')

ipcMain.on('anything-asynchronous', (event, arg) => {
//execute tasks on behalf of renderer process
    console.log(arg) // prints "ping"
})

// renderer process(react-component/App.js)
const { ipcRenderer } = require('electron')

ipcRenderer.send('anything-asynchronous', 'ping')

///// reply async
// main process(main.js)
const { ipcMain } = require('electron')

ipcMain.on('anything-asynchronous', (event, arg) => {
console.log("heyyyy",arg) // prints "heyyyy ping"
    event.reply('asynchronous-reply', 'pong')
})


// renderer process(react-component/App.js)
const { ipcRenderer } = require('electron')

ipcRenderer.send('anything-asynchronous', 'ping')
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log("Hiii",arg) // prints "Hiii pong"
})

///// sync
//main process
const { ipcMain } = require('electron')

ipcMain.on('anything-synchronous', (event, arg) => {
      console.log(arg) // prints "ping"
      event.returnValue = 'pong' // returns a value to renderer process
})


//renderer process
const { ipcRenderer } = require('electron')

console.log(ipcRenderer.sendSync('anything-synchronous', 'ping')) // prints "pong"
*/