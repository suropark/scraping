const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const creds = require('./config/bamboo-mercury-304602-746cd23b610c.json');
const playwright = require('playwright');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { acryptos } = require('./farm');
const doc = new GoogleSpreadsheet(
  '11GwfT-PymW69m3cNZZNkFRQqZw-TOrodIvBcF6gHWBA',
);
let table = [];

// 1. get data from web using scraping
(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  await acryptos(page, table);
  await page.goto('https://pancakeswap.finance/farms');
  // // something else etc..
  // // find another page.
  await browser.close();
  // 2. add values to google sheets using api
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const firstSheet = doc.sheetsByIndex[0];
  await firstSheet.addRows(table);
})();
