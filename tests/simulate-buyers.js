const { chromium } = require('playwright');

const campaigns = [
    'facebook#india#red-tshirt',
    'instagram#india#red-tshirt',
    'twitter#usa#sneakers',
    'facebook#usa#sneakers',
    'instagram#usa#sneakers',
    'facebook#germany#bluejeans',
    'twitter#germany#bluejeans',
    'twitter#japan#sneakers',
    'instagram#japan#sneakers',
    'facebook#france#red-tshirt',
    'instagram#france#red-tshirt',
    'twitter#brazil#bluejeans',
    'facebook#brazil#bluejeans'
];

const BASE_URL = 'https://dummystore-theta.vercel.app'; // Replace with your real site URL

async function simulateUser(campaign) {
  const browser = await chromium.launch({ headless: true }); // set headless: false if you want to see browser
  const page = await browser.newPage();

  const [country] = campaign.split('#');

  const campaignURL = `${BASE_URL}/?utm_source=${country}&utm_medium=cpc&utm_campaign=${campaign}`;
  await page.goto(campaignURL);

  await page.waitForTimeout(1000 + Math.random() * 1000);

  // Go to products
  await page.click('text=Browse Products');
  await page.waitForTimeout(1000);

  // Add first product to cart
  await page.click('text=Add to Cart');
  await page.waitForTimeout(1000);

  // Go to cart
  await page.goto(`${BASE_URL}/cart`);
  await page.waitForTimeout(1000);

  // Proceed to checkout
  await page.click('text=Proceed to Checkout');
  await page.waitForTimeout(1000);

  // Place Order
  await page.click('text=Place Order');
  await page.waitForTimeout(2000); // Wait so that purchase event fires

  console.log(`✅ Purchase simulated for campaign: ${campaign}`);

  await browser.close();
}

async function runLoadTest() {
  const users = 100; // How many users to simulate
  const promises = [];

  for (let i = 0; i < users; i++) {
    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    promises.push(simulateUser(randomCampaign));
  }

  await Promise.all(promises);
}

runLoadTest();
