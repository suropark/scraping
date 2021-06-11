module.exports.acryptos = async function acryptos(page, table) {
  await page.goto('https://app.acryptos.com/');
  await page.waitForSelector(
    '#vaults > div:nth-child(2) > div.d-flex > div.flex-grow-1.row.g-0 > div.col-sm-5.col-5 > div > div.col-sm.col-12',
    { state: 'attached' },
  );
  const farmCount = await page.$eval('#vaults', (el) => el.childElementCount);
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
};

module.exports.pancakeswap = async function pancakeswap(page, table) {
  await page.goto('https://pancakeswap.finance/farms');
};
