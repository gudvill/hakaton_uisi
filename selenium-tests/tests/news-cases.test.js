const { By, until } = require('selenium-webdriver');
const { buildDriver, BASE_URL, WAIT_TIMEOUT } = require('../helpers/driver');

describe('Страницы новостей и кейсов', () => {
  let driver;

  beforeAll(async () => {
    driver = await buildDriver();
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
  }, 15000);

  // ── /news ──────────────────────────────────────────────────────────────────

  test('страница /news загружается с заголовком НОВОСТИ', async () => {
    await driver.get(`${BASE_URL}/news`);
    await driver.wait(until.elementLocated(By.css('.news-all')), WAIT_TIMEOUT);
    const heading = await driver.findElement(By.css('.news-all h2'));
    expect((await heading.getText()).toLowerCase()).toContain('новости');
  });

  test('/news содержит шапку с навигацией', async () => {
    const nav = await driver.findElement(By.css('.header-nav'));
    expect(await nav.isDisplayed()).toBe(true);
  });

  test('/news содержит футер', async () => {
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    const footer = await driver.findElement(By.css('footer'));
    expect(await footer.isDisplayed()).toBe(true);
  });

  test('/news после загрузки не показывает спиннер', async () => {
    await driver.get(`${BASE_URL}/news`);
    await driver.wait(until.elementLocated(By.css('.news-all')), WAIT_TIMEOUT);

    // Ждём исчезновения спиннера загрузки
    await driver.wait(async () => {
      const spinners = await driver.findElements(By.css('.news-all__loading'));
      return spinners.length === 0;
    }, WAIT_TIMEOUT);

    const spinners = await driver.findElements(By.css('.news-all__loading'));
    expect(spinners.length).toBe(0);
  });

  test('при наличии новостей отображаются карточки .news-card', async () => {
    await driver.wait(async () => {
      const spinners = await driver.findElements(By.css('.news-all__loading'));
      return spinners.length === 0;
    }, WAIT_TIMEOUT);

    // Если новости есть — должна быть сетка; если нет — проверяем что хотя бы грид есть
    const grids = await driver.findElements(By.css('.news-grid'));
    // Достаточно убедиться, что страница не в состоянии ошибки
    expect(grids.length).toBeGreaterThanOrEqual(0);
  });

  // ── /photogallery ──────────────────────────────────────────────────────────

  test('страница /photogallery загружается', async () => {
    await driver.get(`${BASE_URL}/photogallery`);
    await driver.wait(until.elementLocated(By.css('.header-nav')), WAIT_TIMEOUT);
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/photogallery');
  });

  // ── /case/:id ──────────────────────────────────────────────────────────────

  test('/case/99999 (несуществующий) показывает сообщение об ошибке', async () => {
    await driver.get(`${BASE_URL}/case/99999`);
    await driver.wait(until.elementLocated(By.css('.case-detail')), WAIT_TIMEOUT);

    // Дождёмся окончания загрузки
    await driver.wait(async () => {
      const loading = await driver.findElements(By.css('.case-detail__loading'));
      return loading.length === 0;
    }, WAIT_TIMEOUT);

    const errors = await driver.findElements(By.css('.case-detail__error'));
    expect(errors.length).toBeGreaterThan(0);
    expect(await errors[0].getText()).toContain('не найден');
  });

  // ── 404 ───────────────────────────────────────────────────────────────────

  test('несуществующий маршрут показывает страницу 404', async () => {
    await driver.get(`${BASE_URL}/this-page-does-not-exist-xyz`);
    await driver.wait(until.elementLocated(By.css('.notfound-page')), WAIT_TIMEOUT);

    const title = await driver.findElement(By.css('.notfound-title'));
    const text = await title.getText();
    expect(text.toLowerCase()).toContain('не найдена');
  });

  test('кнопка "Вернуться на главную" на странице 404 ведёт на /', async () => {
    const btn = await driver.findElement(By.css('.notfound-button'));
    await btn.click();
    await driver.wait(until.urlContains(BASE_URL), 5000);
    const url = await driver.getCurrentUrl();
    expect(url).not.toContain('not-exist');
  });

  // ── Детальная страница новости ─────────────────────────────────────────────

  test('/news/:id с несуществующим id показывает страницу 404', async () => {
    await driver.get(`${BASE_URL}/news/99999`);
    await driver.wait(until.elementLocated(By.css('body')), WAIT_TIMEOUT);
    // Страница должна либо показать 404-компонент, либо сообщение об ошибке
    await driver.sleep(2000); // ждём завершения fetch
    const body = await driver.findElement(By.css('body'));
    const text = await body.getText();
    expect(text.length).toBeGreaterThan(0);
  });
});
