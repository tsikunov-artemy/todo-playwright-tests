import { expect, test } from "@playwright/test";
import * as allure from "allure-js-commons";

const TODO_URL = "https://demo.playwright.dev/todomvc";

test("Удаление задачи через hover и кнопку destroy @allure.id:75214", async ({ page }) => {
  const todoText = `todo to delete ${Date.now()} ${Math.floor(Math.random() * 1000)}`;

  await allure.label("feature", "Удаление задач!");
  await allure.label("story", "Удаление отдельной задачи");

  await allure.step("Открываем главную страницу приложения", async () => {
    await page.goto(TODO_URL);
  });

  await allure.step("Создаем новую задачу", async () => {
    const newTodoInput = page.getByPlaceholder("What needs to be done?");
    await newTodoInput.fill(todoText);
    await newTodoInput.press("Enter");
  });

  await allure.step("Наводим курсор на строку задачи", async () => {
    await page.locator(".todo-list-broken li", { hasText: todoText }).hover();
  });

  await allure.step("Нажимаем кнопку destroy", async () => {
    await page.locator(".todo-list-broken li", { hasText: todoText }).locator(".destroy").click();
  });

  await allure.step("Проверяем что выбранная задача удалена из списка", async () => {
    await expect(page.locator(".todo-list li")).toHaveCount(0);
  });
});
