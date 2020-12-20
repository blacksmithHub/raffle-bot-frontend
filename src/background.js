'use strict'

import { app, protocol, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { uniqueNamesGenerator, names } from 'unique-names-generator'

const config = {
  dictionaries: [names]
}

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
ipcMain.on('automate', async (event, arg) => {
  const task = JSON.parse(arg)

  for (let index = 0; index < task.account.accounts.length; index++) {
    const firstName = uniqueNamesGenerator(config)
    const lastName = uniqueNamesGenerator(config)

    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=800,600'],
      defaultViewport: null,
      executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
    })

    const page = await browser.newPage()

    await page.setRequestInterception(true)

    page.on('request', (request) => {
      const url = request.url()
      const resourceType = request.resourceType()

      const filters = ['queue-it.net']

      const shouldAbort = filters.some((urlPart) => url.includes(urlPart))

      if (shouldAbort ||
        resourceType === 'media' ||
        url.endsWith('.png') ||
        url.endsWith('.gif') ||
        url.endsWith('.jpg')
      ) {
        request.abort()
      } else {
        request.continue()
      }
    })

    await page.goto('https://www.titan22.com/customer/account/login/')

    await page.waitForSelector('#email')
    await page.waitForSelector('#pass')
    await page.waitForSelector('#send2')

    await page.type('#email', task.account.accounts[index].email)
    await page.type('#pass', task.account.accounts[index].password)
    await page.click('#send2')

    await page.waitForNavigation()

    if (page.url() === 'https://www.titan22.com/customer/account/login/') {
      await page.waitForSelector('#firstname')
      await page.waitForSelector('#lastname')
      await page.waitForSelector('#email_address')
      await page.waitForSelector('#password')
      await page.waitForSelector('#password-confirmation')
      await page.waitForSelector('.submit')

      console.log(firstName, lastName)

      await page.type('#firstname', firstName) // invalid selector
      await page.type('#lastname', lastName) // invalid selector
      await page.type('#email_address', task.account.accounts[index].email)
      await page.type('#password', task.account.accounts[index].password)
      await page.type('#password-confirmation', task.account.accounts[index].password)
      await page.type('#captcha_user_create', '') // insert 2captcha result
      await page.click('.submit')

      await page.waitForNavigation()

      if (page.url() === 'https://www.titan22.com/customer/account/') {
        await page.goto('https://www.titan22.com/newsletter/manage/')

        await page.waitForSelector('#subscription')
        await page.waitForSelector('.save')

        await page.click('#subscription')
        await page.click('.save')

        await page.waitForNavigation()
        await page.goto('https://www.titan22.com/customer/address/edit/')

        await page.waitForSelector('#firstname')
        await page.waitForSelector('#lastname')
        await page.waitForSelector('#country')
        await page.waitForSelector('#street_1')
        await page.waitForSelector('#street_2')
        await page.waitForSelector('#telephone')
        await page.waitForSelector('#region_id')
        await page.waitForSelector('#zip')
        await page.waitForSelector('.save')

        await page.type('#firstname', firstName)
        await page.type('#lastname', lastName)
        await page.type('#street_1', task.profile.address1)
        await page.type('#street_2', task.profile.address2)
        await page.type('#zip', task.profile.zipCode)
        await page.type('#country', 'PH') // iso selection
        await page.type('#telephone', '09569354075') // auto generate
        await page.type('#region_id', '575') // numeric selection
        await page.type('#city_id', '951') // numeric selection

        await page.waitForNavigation()
        await page.goto('https://google.com') // raffle link

        await page.keyboard.press('Tab') // insert sequence
      } else {
        console.log('invalid credentials')
      }
    } else if (page.url() !== 'https://www.titan22.com/customer/account/login/') {
      console.log('proceed automation')
    }

    await browser.close()
  }
})
