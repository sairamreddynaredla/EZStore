const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = { console: [], networkErrors: [] };

  page.on('console', msg => results.console.push({type: msg.type(), text: msg.text()}));
  page.on('requestfailed', req => results.networkErrors.push({url: req.url(), error: req.failure() && req.failure().errorText}));

  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(1500);

  // Interact with filters if available
  try {
    const range = await page.$('aside input[type=range]');
    if (range) {
      await range.evaluate(el => { el.value = 50; el.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.click('button:has-text("Apply Filters")');
      await page.waitForTimeout(800);
    }
  } catch (e) {}

  console.log('CONSOLE', JSON.stringify(results.console.slice(0,50)));
  console.log('NETERR', JSON.stringify(results.networkErrors.slice(0,50)));

  await browser.close();
})();
