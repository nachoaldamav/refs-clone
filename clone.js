// @ts-check
const { clone } = require('./dist');
const { join } = require('path');

const src = join(__dirname, 'package.json');
const dest = join(__dirname, 'package.back');

async function main() {
  try {
    await clone(src, dest);
    console.log(`File ${src} cloned to ${dest}`);
  } catch (err) {
    console.error(err);
  }
}

main();
