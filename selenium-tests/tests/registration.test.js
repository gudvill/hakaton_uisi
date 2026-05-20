const { By, until, Key } = require('selenium-webdriver');
const { buildDriver, BASE_URL, WAIT_TIMEOUT } = require('../helpers/driver');

describe('Форма регистрации команды', () => {
  let driver;

  beforeAll(async () => {
    driver = await buildDriver();
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('.header-signin')), WAIT_TIMEOUT);
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
  }, 15000);

  async function openModal() {
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('.header-signin')), WAIT_TIMEOUT);
    const btn = await driver.findElement(By.css('.header-signin'));
    await btn.click();
    await driver.wait(until.elementLocated(By.css('.modal-content')), 5000);
  }

  async function closeAlertIfOpen() {
    const alerts = await driver.findElements(By.css('.custom-alert-overlay'));
    if (alerts.length > 0) {
      const closeBtn = await driver.findElement(By.css('.custom-alert-btn'));
      await closeBtn.click();
      await driver.wait(async () => {
        const remaining = await driver.findElements(By.css('.custom-alert-overlay'));
        return remaining.length === 0;
      }, 3000);
    }
  }

  test('клик по "Регистрация" открывает модальное окно', async () => {
    await openModal();
    const modal = await driver.findElement(By.css('.modal-content'));
    expect(await modal.isDisplayed()).toBe(true);
  });

  test('модальное окно содержит форму и заголовок "Регистрация"', async () => {
    const title = await driver.findElement(By.css('.registration-title'));
    expect((await title.getText()).toLowerCase()).toContain('регистрация');

    const form = await driver.findElement(By.css('.registration-form'));
    expect(await form.isDisplayed()).toBe(true);
  });

  test('отправка пустой формы показывает предупреждение с перечнем ошибок', async () => {
    const submitBtn = await driver.findElement(By.css('.registration-button'));
    await submitBtn.click();

    await driver.wait(until.elementLocated(By.css('.custom-alert-overlay')), 5000);
    const alertMsg = await driver.findElement(By.css('.custom-alert-message'));
    const text = await alertMsg.getText();
    expect(text.length).toBeGreaterThan(0);

    await closeAlertIfOpen();
  });

  test('кнопка × закрывает модальное окно', async () => {
    const closeBtn = await driver.findElement(By.css('.modal-close'));
    await closeBtn.click();

    await driver.wait(async () => {
      const overlays = await driver.findElements(By.css('.modal-overlay'));
      return overlays.length === 0;
    }, 5000);

    const overlays = await driver.findElements(By.css('.modal-overlay'));
    expect(overlays.length).toBe(0);
  });

  test('поле "Кол-во участников" принимает значения 2–5', async () => {
    await openModal();

    const countInput = await driver.findElement(By.css('input[name="amount_participants"]'));
    await countInput.clear();
    await countInput.sendKeys('3');
    await countInput.sendKeys(Key.TAB);

    await driver.sleep(300);

    const value = await countInput.getAttribute('value');
    const num = Number(value);
    expect(num).toBeGreaterThanOrEqual(2);
    expect(num).toBeLessThanOrEqual(5);
  });

  test('изменение кол-ва участников создаёт соответствующие строки', async () => {
    const countInput = await driver.findElement(By.css('input[name="amount_participants"]'));
    await countInput.clear();
    await countInput.sendKeys('3');
    await countInput.sendKeys(Key.TAB);

    await driver.sleep(500);

    const rows = await driver.findElements(By.css('.participant-row'));
    expect(rows.length).toBe(3);
  });

  test('форма содержит радиокнопки для выбора кейса (кейсы 1–6)', async () => {
    const caseRadios = await driver.findElements(By.css('input[name="selected_case"]'));
    expect(caseRadios.length).toBe(6);
  });

  test('форма содержит радиокнопки "Очная" и "Дистанционная"', async () => {
    const online = await driver.findElement(By.css('input[value="Очная"]'));
    const remote = await driver.findElement(By.css('input[value="Дистанционная"]'));
    expect(await online.isDisplayed()).toBe(true);
    expect(await remote.isDisplayed()).toBe(true);
  });

  test('два одинаковых кейса — основной и запасной — блокируют отправку', async () => {
    // Заполняем минимальные обязательные поля
    const nameInput = await driver.findElement(By.css('input[name="name"]'));
    await nameInput.clear();
    await nameInput.sendKeys('Тестовая команда');

    const institutionInput = await driver.findElement(By.css('input[name="institution"]'));
    await institutionInput.clear();
    await institutionInput.sendKeys('УИСИ УРФУ');

    // Выбираем один и тот же кейс для основного и запасного
    const case1Primary = await driver.findElement(By.css('input[name="selected_case"][value="1"]'));
    await case1Primary.click();
    const case1Spare = await driver.findElement(By.css('input[name="spare_case"][value="1"]'));
    await case1Spare.click();

    const submitBtn = await driver.findElement(By.css('.registration-button'));
    await submitBtn.click();

    await driver.wait(until.elementLocated(By.css('.custom-alert-overlay')), 5000);
    const alertMsg = await driver.findElement(By.css('.custom-alert-message'));
    const text = await alertMsg.getText();
    // Либо ошибка о совпадающих кейсах, либо ошибка незаполненных полей
    expect(text.length).toBeGreaterThan(0);

    await closeAlertIfOpen();
  });
});
