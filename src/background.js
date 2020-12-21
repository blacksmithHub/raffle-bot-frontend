'use strict'

import { app, protocol, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import Titan22 from '@/Automate/Titan22'
import Commonwealth from '@/Automate/Commonwealth'

const isDevelopment = process.env.NODE_ENV !== 'production'

const puppeteer = require('puppeteer')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 680,
    frame: false,
    minWidth: 900,
    minHeight: 680,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      webSecurity: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  if (!isDevelopment) {
    win.on('focus', () => {
      globalShortcut.register('CommandOrControl+R', () => {})
    })

    win.on('blur', () => {
      globalShortcut.unregister('CommandOrControl+R')
    })
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/**
 * Browser automate
 */
const array = []

/**
 * Stop automation
 */
ipcMain.on('stop', async (event, arg) => {
  const task = JSON.parse(arg)

  const index = array.find((val) => val.id === task.id)

  index.browser.close()

  array.splice(index, 1)
})

/**
 * Execute automation
 */
ipcMain.on('automate', async (event, arg) => {
  const task = JSON.parse(arg)

  for (let index = 0; index < task.account.accounts.length; index++) {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=800,600'],
      defaultViewport: null,
      executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
    })

    array.push({ id: task.id, browser: browser })

    switch (task.store.id) {
      case 1:
        Titan22.automate(task, index, browser)
        break
      case 2:
        Commonwealth.automate(task, index, browser)
        break
    }
  }
})
