const { default: puppeteer } = require('puppeteer')
const { writeFile, readFile } = require('fs/promises')
const { load } = require('cheerio')

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 768,
      width: 1366
    }
  })

  const page = await browser.newPage()
  await page.goto('https://www.amazon.in')
  await page.type('#twotabsearchtextbox', 'iphone')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(5000)
  // const html = await page.content()
  // await writeFile('amazon.html', html)

  const productsData = []
  const $ = load(await page.content())
  $('div[data-component-type="s-search-result"] h2').each((_, el) => {
    productsData.push({
      name: $(el).text()
    })
  })
  await writeFile('products.json', JSON.stringify(productsData))
  await browser.close()
}

main

const second = async () => {
  const productsData = JSON.parse(await readFile('products.json', 'utf-8'))
  console.log(Object.entries(productsData[0]))
}

second()
