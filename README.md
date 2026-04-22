# Playwright Tests (TypeScript)

Шаблон для автотестов Playwright + TypeScript, когда тестируемое приложение внешнее и его код не лежит в этом репозитории.

## 1. Установка

```bash
npm install
npm run pw:install
```

## 2. Настройка окружения

Скопируйте пример env-файла и укажите адрес внешнего приложения:

```bash
cp .env.example .env
```

Пример:

```env
BASE_URL=https://your-app.example.com
```

## 3. Запуск тестов

```bash
npm test
```

Полезные команды:

- `npm run test:headed` - запуск с браузером
- `npm run test:ui` - UI режим Playwright
- `npm run test:debug` - отладка

## 4. Allure Report v3

Allure-результаты теперь собираются автоматически при каждом запуске тестов в папку `allure-results`.

Команды:

- `npm run allure:generate` - сгенерировать single-file отчет (`allure-report/index.html`, можно открыть двойным кликом)
- `npm run allure:open` - открыть уже сгенерированный отчет
- `npm run allure:serve` - поднять временный сервер прямо из `allure-results`

## Структура

- `playwright.config.ts` - общая конфигурация Playwright
- `tests/` - тесты
- `.env` - URL внешней системы (`BASE_URL`)

## CI + allurectl

В GitHub Actions запуск идет через `allurectl --insecure watch --silent -- npx playwright test`.

Добавьте в Secrets репозитория:

- `ALLURE_ENDPOINT`
- `ALLURE_TOKEN`
- `ALLURE_PROJECT_ID`

Для запуска workflow из Allure TestOps используется `workflow_dispatch` c входными параметрами:

- `BUILD_ALLURE_REPORT` (checkbox/boolean, по умолчанию выключен)
- `ALLURE_JOB_RUN_ID` (обязателен для связки job run в TestOps)
- `ALLURE_USERNAME` (служебный параметр)

Важно: параметры, которые вы передаете из Allure TestOps в GitHub workflow, должны совпадать с `workflow_dispatch.inputs`, иначе GitHub вернет ошибку `422`.

### Логика сборки в GitHub (`.github/workflows/test.yml`)

Workflow запускается:

- автоматически на `push` в `main`
- автоматически на `pull_request`
- вручную через `workflow_dispatch` (в том числе из Allure TestOps)

Порядок шагов в job `e2e`:

1. Checkout репозитория.
2. Установка Node.js 20 и включение `npm` cache.
3. Установка зависимостей проекта (`npm install`).
4. Установка браузера для Playwright (`npx playwright install --with-deps chromium`).
5. Установка `allurectl`.
6. Запуск тестов через `allurectl --insecure watch --silent -- npx playwright test`:
  - `watch` стримит результаты в Allure TestOps в реальном времени;
  - `--silent` не роняет пайплайн, если TestOps недоступен;
  - `--insecure` отключает проверку TLS-сертификата для подключения к TestOps.
7. Генерация single-file отчета Allure (`allure-report/index.html`) выполняется только для `workflow_dispatch`, если включен чекбокс `BUILD_ALLURE_REPORT`.
8. Upload артефакта `allure-report` выполняется в том же условии.

