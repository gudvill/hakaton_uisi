const { By, until } = require('selenium-webdriver');
const { buildDriver, BASE_URL, WAIT_TIMEOUT } = require('../helpers/driver');

describe('Вход в админ-панель', () => {
  let driver;
  const LOGIN_URL = `${BASE_URL}/admin/login`;

  beforeAll(async () => {
    driver = await buildDriver();
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
  }, 15000);

  async function goToLogin() {
    await driver.get(LOGIN_URL);
    await driver.wait(until.elementLocated(By.css('.login-card')), WAIT_TIMEOUT);
  }

  async function dismissAlertAndRecover() {
    try {
      const alert = await driver.switchTo().alert();
      await alert.accept();
    } catch (_) {
      // алерт уже закрыт или навигация прервала его
    }
    // Возвращаемся на страницу входа в чистое состояние
    await driver.get(LOGIN_URL);
    await driver.wait(until.elementLocated(By.css('.login-card')), WAIT_TIMEOUT);
  }

  // ── Статические проверки UI (не меняют состояние страницы) ────────────────

  test('страница входа загружается и отображает карточку входа', async () => {
    await goToLogin();
    const card = await driver.findElement(By.css('.login-card'));
    expect(await card.isDisplayed()).toBe(true);
  });

  test('заголовок карточки содержит "Вход в админ-панель"', async () => {
    const title = await driver.findElement(By.css('.login-title'));
    expect((await title.getText()).toLowerCase()).toContain('вход');
  });

  test('форма содержит поля логина и пароля', async () => {
    const loginInput = await driver.findElement(By.css('.login-input[type="text"]'));
    const passInput = await driver.findElement(By.css('.login-input[type="password"]'));
    expect(await loginInput.isDisplayed()).toBe(true);
    expect(await passInput.isDisplayed()).toBe(true);
  });

  test('кнопка ВОЙТИ видна и содержит правильный текст', async () => {
    const btn = await driver.findElement(By.css('.login-button'));
    expect(await btn.isDisplayed()).toBe(true);
    expect((await btn.getText()).toLowerCase()).toContain('войти');
  });

  test('ссылка "восстановить пароль" присутствует', async () => {
    const link = await driver.findElement(By.css('.login-restore'));
    expect(await link.isDisplayed()).toBe(true);
  });

  // ── Тесты с навигацией и алертами (идут последними) ───────────────────────

  test('неверные учётные данные вызывают alert с сообщением об ошибке', async () => {
    await goToLogin();

    const loginInput = await driver.findElement(By.css('.login-input[type="text"]'));
    const passInput = await driver.findElement(By.css('.login-input[type="password"]'));
    const btn = await driver.findElement(By.css('.login-button'));

    await loginInput.clear();
    await loginInput.sendKeys('wrong_user_xyz');
    await passInput.clear();
    await passInput.sendKeys('wrong_password_xyz');
    await btn.click();

    await driver.wait(until.alertIsPresent(), 8000);
    const alert = await driver.switchTo().alert();
    const text = await alert.getText();
    expect(text.toLowerCase()).toContain('неверный');

    await dismissAlertAndRecover();
  });

  test('пустые поля тоже вызывают alert с сообщением об ошибке', async () => {
    const loginInput = await driver.findElement(By.css('.login-input[type="text"]'));
    const passInput = await driver.findElement(By.css('.login-input[type="password"]'));
    const btn = await driver.findElement(By.css('.login-button'));

    await loginInput.clear();
    await passInput.clear();
    await btn.click();

    await driver.wait(until.alertIsPresent(), 8000);
    const alert = await driver.switchTo().alert();
    const text = await alert.getText();
    expect(text.length).toBeGreaterThan(0);

    await dismissAlertAndRecover();
  });

  test('клик на логотип переводит на главную страницу', async () => {
    const logo = await driver.findElement(By.css('.login-logo'));
    await logo.click();
    await driver.wait(until.urlContains(BASE_URL), 5000);
    const url = await driver.getCurrentUrl();
    expect(url).not.toContain('/admin/login');
  });
});
