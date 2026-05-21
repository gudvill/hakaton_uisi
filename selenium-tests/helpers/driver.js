const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const BASE_URL = process.env.BASE_URL || 'http://31.57.93.65';
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

  // Используем chromedriver из node_modules — не нужен интернет
  const service = new chrome.ServiceBuilder(chromedriver.path);

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  return driver;
}

module.exports = { buildDriver, BASE_URL, WAIT_TIMEOUT };
