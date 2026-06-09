const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:5174/');

    await page.waitForSelector('text=Brand Banners', { timeout: 5000 });

    const imgs = await page.$$eval('section:has-text("Brand Banners") img', (els) =>
      els.map((e) => e.getAttribute('src'))
    );

    if (!imgs || imgs.length === 0) {
      console.error('No banner images found');
      process.exitCode = 2;
    } else {
      console.log('Found', imgs.length, 'banner images:');
      imgs.forEach((s) => console.log('-', s));
    }
  } catch (err) {
    console.error('Error checking banners:', err.message || err);
    process.exitCode = 3;
  } finally {
    await browser.close();
  }
})();
