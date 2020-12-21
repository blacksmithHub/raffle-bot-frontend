import { uniqueNamesGenerator, names } from 'unique-names-generator'

const config = {
  dictionaries: [names]
}

export default {
  /**
   * Initiate automation
   *
   * @param {*} task
   * @param {*} index
   * @param {*} browser
   */
  async automate (task, index, browser) {
    const firstName = uniqueNamesGenerator(config)
    const lastName = uniqueNamesGenerator(config)

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
        await page.click('.save')

        await page.waitForNavigation()

        await this.start(browser, page, task, index)
      } else {
        await browser.close()
      }
    } else if (page.url() !== 'https://www.titan22.com/customer/account/login/') {
      await this.start(browser, page, task, index)
    } else {
      await browser.close()
    }
  },
  /**
   * Start sequence
   *
   * @param {*} browser
   * @param {*} page
   * @param {*} task
   * @param {*} index
   */
  async start (browser, page, task, index) {
    await page.goto(task.url)

    await page.keyboard.press('Tab') // insert sequence

    await browser.close()
  }
}
