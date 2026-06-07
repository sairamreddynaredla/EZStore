const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/');

  await page.waitForSelector('text=Pet Food Shop', { timeout: 5000 });

  const getCount = async () => {
    const el = await page.$('p:has-text("Products Found")');
    if (!el) return null;
    const txt = await el.textContent();
    const m = txt && txt.match(/(\d+)/);
    return m ? Number(m[1]) : null;
  };

  const before = await getCount();

  // interact with first sidebar range and apply
  const range = await page.$('aside input[type=range]');
  if (!range) {
    console.error('no range slider found');
    await browser.close();
    process.exit(2);
  }
  await range.evaluate((el) => { el.value = 50; el.dispatchEvent(new Event('input', { bubbles: true })); });

  const apply = await page.$('button:has-text("Apply Filters")');
  if (!apply) {
    console.error('no apply button found');
    await browser.close();
    process.exit(2);
  }
  await apply.click();

  await page.waitForTimeout(1000);
  const after = await getCount();

  console.log({ before, after, changed: before !== after });

  await browser.close();
})();
