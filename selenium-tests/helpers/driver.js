const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WAIT_TIMEOUT = 10000;

// Передай HEADLESS=false чтобы видеть браузер: set HEADLESS=false && npm test
const headless = process.env.HEADLESS !== 'false';

async function buildDriver() {
  const options = new chrome.Options();
  if (headless) {
    options.addArguments('--headless=new');
  }
  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1440,900'
  );

  // selenium-webdriver 4.x автоматически загружает подходящий chromedriver
  // через встроенный Selenium Manager — версия всегда совпадёт с Chrome
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = { buildDriver, BASE_URL, WAIT_TIMEOUT };
