import { expect, test } from "@playwright/test";
import * as allure from "allure-js-commons";

const TODO_URL = "https://demo.playwright.dev/todomvc";

test("Создание новой задачи @allure.id:75216", async ({ page }) => {
  const todoText = `new todo ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Управление задачами");
  await allure.label("story", "Создание задачи");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Вводим уникальный текст новой задачи", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(todoText);
    await newTodoInput.press("Enter");
  });

  await allure.step("Проверяем что новая задача отображается в списке", async () => {
    await expect(page.locator(".todo-list li", { hasText: todoText })).toBeVisible();
  });

  await allure.step("Проверяем что у новой задачи активный статус", async () => {
    await expect(
      page.locator(".todo-list li", { hasText: todoText }).getByRole("checkbox"),
    ).not.toBeChecked();
  });
});

test("Пустая задача не создается @allure.id:75217", async ({ page }) => {
  await allure.label("feature", "Управление задачами");
  await allure.label("story", "Валидация ввода при создании");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Устанавливаем фокус в поле ввода задачи", async () => {
    await page.getByPlaceholder("What needs to be done?").click();
  });

  await allure.step("Нажимаем Enter с пустым значением", async () => {
    await page.getByPlaceholder("What needs to be done?").press("Enter");
  });

  await allure.step("Проверяем что новая задача в списке не появилась", async () => {
    await expect(page.locator(".todo-list li")).toHaveCount(0);
  });
});
