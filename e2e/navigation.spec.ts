import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should highlight the active section in sidebar', async ({ page }) => {
    const activeItem = page.locator('.nav-item-selected')
    await expect(activeItem).toHaveCount(1)
  })

  test('should navigate to experience section via sidebar link', async ({ page }) => {
    const experienceLink = page.locator('.nav-links .nav-link').filter({ hasText: 'Experience' })
    await experienceLink.click()

    const section = page.locator('#experience')
    await expect(section).toBeVisible()
  })

  test('should navigate to education section via sidebar link', async ({ page }) => {
    const link = page.locator('.nav-links .nav-link').filter({ hasText: 'Education' })
    await link.click()

    const section = page.locator('#education')
    await expect(section).toBeVisible()
  })

  test('should navigate to skills section via sidebar link', async ({ page }) => {
    const link = page.locator('.nav-links .nav-link').filter({ hasText: 'Skills' })
    await link.click()

    const section = page.locator('#skills')
    await expect(section).toBeVisible()
  })

  test('should navigate to contact section via sidebar link', async ({ page }) => {
    const link = page.locator('.nav-links .nav-link').filter({ hasText: 'Contact' })
    await link.click()

    const section = page.locator('#contact')
    await expect(section).toBeVisible()
  })

  test('should display the language picker', async ({ page }) => {
    const langPicker = page.locator('.nav-sidebar .language-picker, .nav-sidebar .language-label')
    const count = await langPicker.count()
    expect(count).toBeGreaterThan(0)
  })
})
