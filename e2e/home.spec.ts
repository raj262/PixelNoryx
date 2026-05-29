import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows brand", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/PixelNoryx/i);
    await expect(page.getByRole("link", { name: /pixel.*noryx/i }).first()).toBeVisible();
  });

  test("navigates to archive", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /archive/i }).first().click();
    await expect(page).toHaveURL(/\/archive/);
  });

  test("footer credits Rajesh", async ({ page }) => {
    await page.goto("/");
    const rajeshLink = page.getByRole("link", { name: "Rajesh" });
    await expect(rajeshLink).toBeVisible();
    await expect(rajeshLink).toHaveAttribute("href", "https://rajeshcodes.in/");
  });
});
