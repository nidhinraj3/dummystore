
//use  node simulate-buyers.js to run this tests


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

async function getPageTexts(page) {
  const texts = await page.evaluate(() => {
    const body = document.querySelector('body');
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const texts = [];
    while (walker.nextNode()) {
      texts.push(walker.currentNode.textContent.trim());
    }
    return texts;
  });

  console.log('📝 Texts found on the page:');
  texts.forEach((text, idx) => {
    console.log(`${idx + 1}: ${text}`);
  });
}

async function simulateUser(campaign,i) {
  const browser = await chromium.launch({ headless: true }); // set headless: false if you want to see browser
  const page = await browser.newPage();

  const [country] = campaign.split('#');

  const campaignURL = `${BASE_URL}/?utm_source=${country}&utm_medium=cpc&utm_campaign=${campaign}`;
  await page.goto(campaignURL);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  // Go to products
  await page.click('text=Browse Products');
  await page.waitForTimeout(1000);
  // Step 3: Find Add to Cart buttons properly
  const addToCartButtons = await page.locator('button:has-text("Add to Cart")').all();
  if (addToCartButtons.length === 0) {
    console.error('❌ No Add to Cart buttons found!');
    await browser.close();
    return;
  }
  // Step 4: Click a random Add to Cart button
  const randomIndex = Math.floor(Math.random() * addToCartButtons.length);
  await addToCartButtons[randomIndex].click();
  await page.waitForTimeout(1000);
  // Go to cart
  await page.click("text=Cart");
  await page.waitForTimeout(1000);
  await page.waitForSelector('text=Proceed to Checkout');

  // Proceed to checkout
  await page.click('text=Proceed to Checkout');
  await page.waitForTimeout(1000);

  await page.waitForSelector('text=Place Order');
  // Place Order
  await page.click('text=Place Order');
  await page.waitForTimeout(2000); // Wait so that purchase event fires
 
  console.log(`✅ Purchase simulated for campaign ${i}: ${campaign}`);
  await browser.close();
}

async function runLoadTest() {
  const users = 100; // How many users to simulate
  const promises = [];
  for (let i = 0; i < users; i++) {
    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    promises.push(simulateUser(randomCampaign,i));
  }
  await Promise.all(promises);
}

runLoadTest();
