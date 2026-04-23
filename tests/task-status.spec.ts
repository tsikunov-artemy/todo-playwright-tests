import { expect, test } from "@playwright/test";
import * as allure from "allure-js-commons";

const TODO_URL = "https://demo.playwright.dev/todomvc";

test("Перевод активной задачи в completed @allure.id:75218", async ({ page }) => {
  const todoText = `active todo ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Статусы задач");
  await allure.label("story", "Смена статуса задачи на completed");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем новую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(todoText);
    await newTodoInput.press("Enter");
  });

  await allure.step("Отмечаем задачу как completed", async () => {
    await page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox").check();
  });

  await allure.step("Проверяем что задача стала completed", async () => {
    await expect(
      page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox"),
    ).toBeChecked();
  });

  await allure.step("Проверяем что к задаче применился стиль завершенной задачи", async () => {
    await expect(page.locator(".todo-list li", { hasText: todoText })).toHaveClass(/completed/);
  });
});

test("Возврат completed-задачи в active @allure.id:75220", async ({ page }) => {
  const todoText = `completed todo ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Статусы задач");
  await allure.label("story", "Смена статуса задачи обратно на active");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем новую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(todoText);
    await newTodoInput.press("Enter");
  });

  await allure.step("Отмечаем задачу как completed", async () => {
    await page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox").check();
  });

  await allure.step("Возвращаем completed-задачу в active", async () => {
    await page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox").uncheck();
  });

  await allure.step("Проверяем что задача стала active", async () => {
    await expect(
      page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox"),
    ).not.toBeChecked();
  });
});

test("Счетчик items left показывает число активных задач @allure.id:75219", async ({ page }) => {
  const firstTodo = `first active ${Date.now()} ${Math.floor(Math.random() * 1000)}`;
  const secondTodo = `second completed ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Статусы задач");
  await allure.label("story", "Отображение количества активных задач");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем первую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(firstTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Создаем вторую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(secondTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Отмечаем вторую задачу как completed", async () => {
    await page.locator(".todo-list li", { hasText: secondTodo }).getByRole("checkbox").check();
  });

  await allure.step("Проверяем что значение счетчика равно количеству активных задач", async () => {
    await expect(page.locator(".todo-count")).toContainText("1 item left");
  });
});
