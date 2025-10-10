import { chromium } from 'playwright';
import { resolve } from 'path';

async function generateOgImage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });

  const htmlPath = resolve('website/index.html');
  await page.goto(`file://${htmlPath}`);

  // Fill in example values
  await page.fill('#target', '355');
  const numberCards = await page.locator('.number-card').all();
  const exampleNumbers = ['3', '3', '5', '6', '8', '100'];
  for (let i = 0; i < exampleNumbers.length; i++) {
    await numberCards[i].fill(exampleNumbers[i]);
  }

  // Wait for styles to load
  await page.waitForTimeout(500);

  // Take screenshot
  const pngPath = resolve('website/public/og-image.png');
  await page.screenshot({
    path: pngPath,
    type: 'png',
  });

  await browser.close();
  console.log('✓ Generated og-image.png from HTML');
}

generateOgImage().catch((err) => {
  console.error('Error generating og-image.png:', err);
  process.exit(1);
});

