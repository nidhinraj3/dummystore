import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // ramp up to 50 users
    { duration: '1m', target: 100 },  // stay at 100 users
    { duration: '30s', target: 0 },   // ramp down
  ],
};

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

export default function () {
  const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
  
  const url = `https://dummystore-theta.vercel.app/?utm_source=${campaign.split('-')[0]}&utm_medium=cpc&utm_campaign=${campaign}`;
  
  // Visit Home page with campaign params
  const res = http.get(url);
  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(Math.random() * 2);

  // Visit products
  http.get(`https://dummystore-theta.vercel.app/products`);
  sleep(Math.random() * 2);

  // Go to cart
  http.get(`https://dummystore-theta.vercel.app/cart`);
  sleep(Math.random() * 1);

  // Go to checkout
  http.get(`https://dummystore-theta.vercel.app/checkout`);
  sleep(Math.random() * 1);

  // Go to thank you page
  http.get(`https://dummystore-theta.vercel.app/thank-you`);
}
