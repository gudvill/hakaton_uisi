const { By, until } = require('selenium-webdriver');
const { buildDriver, BASE_URL, WAIT_TIMEOUT } = require('../helpers/driver');

describe('Главная страница', () => {
  let driver;

  beforeAll(async () => {
    driver = await buildDriver();
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('.header-nav')), WAIT_TIMEOUT);
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
  }, 15000);

  test('страница загружается и имеет заголовок', async () => {
    const title = await driver.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('шапка содержит не менее 5 навигационных ссылок', async () => {
    const links = await driver.findElements(By.css('.header-link'));
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  test('кнопка "Регистрация" видна и содержит нужный текст', async () => {
    const btn = await driver.findElement(By.css('.header-signin'));
    expect(await btn.isDisplayed()).toBe(true);
    const text = await btn.getText();
    expect(text.toLowerCase()).toContain('регистрация');
  });

  test('секция FAQ присутствует на странице', async () => {
    const faq = await driver.findElement(By.id('faq'));
    const heading = await faq.findElement(By.css('h2'));
    expect(await heading.getText()).toMatch(/faq/i);
  });

  test('логотип в шапке — это ссылка на главную страницу', async () => {
    const logo = await driver.findElement(By.css('.header-logo'));
    const href = await logo.getAttribute('href');
    expect(href).toMatch(/^http:\/\/localhost:3000\/?$/);
  });

  test('футер присутствует на странице', async () => {
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    const footer = await driver.findElement(By.css('footer'));
    expect(await footer.isDisplayed()).toBe(true);
  });

  test('FAQ аккордеон раскрывается по клику', async () => {
    await driver.get(BASE_URL + '/#faq');
    await driver.wait(until.elementLocated(By.css('.faq-item')), WAIT_TIMEOUT);
    const firstItem = await driver.findElement(By.css('.faq-item'));
    const btn = await firstItem.findElement(By.css('.faq-header'));

    // Ответ изначально скрыт
    const answerBefore = await firstItem.findElements(By.css('.faq-answer--open'));
    expect(answerBefore.length).toBe(0);

    await btn.click();
    await driver.wait(until.elementLocated(By.css('.faq-answer--open')), 3000);
    const answerAfter = await driver.findElements(By.css('.faq-answer--open'));
    expect(answerAfter.length).toBeGreaterThan(0);
  });
});
