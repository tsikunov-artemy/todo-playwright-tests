import { expect, test } from "@playwright/test";
import * as allure from "allure-js-commons";

const TODO_URL = "https://demo.playwright.dev/todomvc";

test("Фильтр Active показывает только активные", async ({ page }) => {
  const activeTodo = `active filter ${Date.now()} ${Math.floor(Math.random() * 1000)}`;
  const completedTodo = `completed filter ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Фильтрация задач");
  await allure.label("story", "Фильтрация по активным задачам");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем первую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(activeTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Создаем вторую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(completedTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Отмечаем вторую задачу как completed", async () => {
    await page.locator(".todo-list li", { hasText: completedTodo }).getByRole("checkbox").check();
  });

  await allure.step("Нажимаем фильтр Active", async () => {
    await page.getByRole("link", { name: "Active" }).click();
  });

  await allure.step("Проверяем что отображаются только активные задачи", async () => {
    await expect(page.locator(".todo-list li", { hasText: activeTodo })).toBeVisible();
  });

  await allure.step("Проверяем что завершенные задачи скрыты", async () => {
    await expect(page.locator(".todo-list li", { hasText: completedTodo })).toBeHidden();
  });
});

test("Фильтр Completed показывает только завершенные", async ({ page }) => {
  const activeTodo = `active completed filter ${Date.now()} ${Math.floor(Math.random() * 1000)}`;
  const completedTodo = `completed completed filter ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Фильтрация задач");
  await allure.label("story", "Фильтрация по завершенным задачам");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем первую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(activeTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Создаем вторую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(completedTodo);
    await newTodoInput.press("Enter");
  });

  await allure.step("Отмечаем вторую задачу как completed", async () => {
    await page.locator(".todo-list li", { hasText: completedTodo }).getByRole("checkbox").check();
  });

  await allure.step("Нажимаем фильтр Completed", async () => {
    await page.getByRole("link", { name: "Completed" }).click();
  });

  await allure.step("Проверяем что отображаются только завершенные задачи", async () => {
    await expect(page.locator(".todo-list li", { hasText: completedTodo })).toBeVisible();
  });

  await allure.step("Проверяем что активные задачи скрыты", async () => {
    await expect(page.locator(".todo-list li", { hasText: activeTodo })).toBeHidden();
  });
});
