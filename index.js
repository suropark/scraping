const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const creds = require('./config/bamboo-mercury-304602-45c10cbae5c8.json');
const playwright = require('playwright');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(
  '11GwfT-PymW69m3cNZZNkFRQqZw-TOrodIvBcF6gHWBA',
);
let table = [];

app.get('/', async (req, res) => {
  // 1. get data from web using scraping
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app.acryptos.com/');
  await page.waitForSelector(
    '#vaults > div:nth-child(2) > div.d-flex > div.flex-grow-1.row.g-0 > div.col-sm-5.col-5 > div > div.col-sm.col-12',
    { state: 'attached' },
  );
  const farmCount = await page.$eval('#vaults', (el) => el.childElementCount);
  console.log(farmCount);
  for (let i = 2; i < farmCount + 1; i++) {
    let body = {
      farm: 'acryptos',
      pool: await page.innerHTML(
        `#vaults > div:nth-child(${i}) > div.d-flex > div.flex-grow-1.row.g-0 > div.col-sm-5.col-5 > div > div.col-sm.col-12`,
      ),
      apy: await page.innerHTML(
        `#vaults > div:nth-child(${i}) > div.d-flex > div.flex-grow-1.row.g-0 > div.col-3 > div > div:nth-child(1) > span > span`,
      ),
      daily: await page.innerHTML(
        `#vaults > div:nth-child(${i}) > div.d-flex > div.flex-grow-1.row.g-0 > div.col-3 > div > div:nth-child(2) > span > small > span`,
      ),
    };
    console.log(
      `farm: ${body.farm} pool: ${body.pool.trim()}, apy: ${body.apy}, daily: ${
        body.daily
      }`,
    );
    table.push(body);
  }
  // await page.goto('https://pancakeswap.finance/farms');
  // something else etc..
  // find another page.
  await browser.close();
  // 2. add values to google sheets using api
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const firstSheet = doc.sheetsByIndex[0];
  for (i = 0; i < farmCount - 1; i++) {
    await firstSheet.addRow({
      farm: table[i].farm,
      pool: table[i].pool.trim(),
      apy: table[i].apy,
      daily: table[i].daily,
    });
  }
});

app.listen(port, () => console.log(`running on port ${port}`));
