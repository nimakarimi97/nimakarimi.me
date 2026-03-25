import { expect, test } from '@playwright/test'

test.describe('Hobbies Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the hobbies section title', async ({ page }) => {
    const section = page.locator('#hobbies')
    await expect(section).toBeVisible()
    await expect(section.locator('.section-title')).toContainText('Hobbies')
  })

  test('should display activity items', async ({ page }) => {
    const section = page.locator('#hobbies')
    await expect(section).toContainText('Family & Friends')
    await expect(section).toContainText('My Projects')
    await expect(section).toContainText('Exercise')
    await expect(section).toContainText('Cooking')
  })

  test('should display interest items', async ({ page }) => {
    const section = page.locator('#hobbies')
    await expect(section).toContainText('Hiking')
    await expect(section).toContainText('CrossFit')
    await expect(section).toContainText('Chess')
    await expect(section).toContainText('Programming')
    await expect(section).toContainText('Coffee')
  })

  test('should display the interests subcategory heading', async ({ page }) => {
    const section = page.locator('#hobbies')
    await expect(section).toContainText('Interests')
  })
})
