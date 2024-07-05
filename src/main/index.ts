import { app, shell, BrowserWindow, ipcMain, Tray, nativeImage, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/AppIcon.png?asset'
import { fetchFriends, fetchPresences, fetchUserData } from './RobloxApi'

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: icon,
    width: 630,
    height: 275,
    minWidth: 630,
    minHeight: 275,
    transparent: true,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
let tray

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //set tray
  const TrayIcon = nativeImage.createFromPath(icon)
  tray = new Tray(TrayIcon)

  tray.setToolTip('Severion')
  tray.setTitle('Severion')

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show',
        click: (): void => {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.show()
          })
        }
      },
      {
        label: 'Exit',
        click: (): void => {
          app.quit()
        }
      }
    ])
  )

  // Set app user model id for windows
  electronApp.setAppUserModelId('Severion')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC Handlers
  ipcMain.handle('fetchUserData', async (_, cookie) => {
    const UserData = await fetchUserData(cookie)
    if (!UserData) {
      console.error('Failed to fetch user data')
      return undefined
    }
    return UserData
  })

  ipcMain.handle('fetchFriends', async (_, userId) => {
    const Friends = await fetchFriends(userId)
    if (!Friends) {
      console.error('Failed to fetch friends')
      return undefined
    }
    return Friends
  })

  ipcMain.handle('fetchPresences', async (_, userIds, cookie) => {
    const UserPresences = await fetchPresences(userIds, cookie)
    if (!UserPresences) {
      console.error('Failed to fetch user presences')
      return undefined
    }
    return UserPresences
  })

  ipcMain.handle('minimize', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.minimize()
    }
  })

  ipcMain.handle('maximize', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize()
      } else {
        focusedWindow.maximize()
      }
    }
  })

  ipcMain.handle('hide', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.hide()
      tray.displayBalloon({
        title: 'Severion',
        content: 'Severion is running in the background, click the tray icon to show or close it.',
        iconType: 'info'
      })
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
