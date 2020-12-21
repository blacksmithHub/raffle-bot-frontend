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

    await page.goto('https://commonwealth-ftgg.ph/account/login')

    await page.waitForSelector('#customer_email')
    await page.waitForSelector('#customer_password')
    await page.waitForSelector('input[value="Login"]')

    await page.type('#customer_email', task.account.accounts[index].email)
    await page.type('#customer_password', task.account.accounts[index].password)
    await page.click('input[value="Login"]')

    await page.waitForNavigation()

    if (page.url() === 'https://commonwealth-ftgg.ph/challenge') {
      // solve captcha
    }

    await page.waitForNavigation()

    if (page.url() === 'https://commonwealth-ftgg.ph/account/login') {
      await page.goto('https://commonwealth-ftgg.ph/account/register')

      await page.waitForSelector('#first_name')
      await page.waitForSelector('#last_name')
      await page.waitForSelector('#email')
      await page.waitForSelector('#password')
      await page.waitForSelector('input[value="Sign Up"]')

      await page.type('#first_name', firstName)
      await page.type('#last_name', lastName)
      await page.type('#email', task.account.accounts[index].email)
      await page.type('#password', task.account.accounts[index].password)
      // await page.click('input[value="Sign Up"]')

      await page.waitForNavigation()
    } else if (page.url() === 'https://commonwealth-ftgg.ph/account') {
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

    await browser.close()
  }
}
