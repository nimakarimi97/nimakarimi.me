import { expect, test } from '@playwright/test'

test.describe('App Loading', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/Nima/i)
  })

  test('should render the sidebar navigation on desktop', async ({ page }) => {
    await page.goto('/about')
    const sidebar = page.locator('.nav-sidebar')
    await expect(sidebar).toBeVisible()
  })

  test('should display the profile card with name and role', async ({ page }) => {
    await page.goto('/about')
    const profileName = page.locator('.nav-profile-card-title').first()
    await expect(profileName).toContainText('Nima Karimi')

    const profileRole = page.locator('.nav-profile-card-subtitle').first()
    await expect(profileRole).toContainText('Software Engineer')
  })

  test('should render navigation links for all sections', async ({ page }) => {
    await page.goto('/about')
    const navLinks = page.locator('.nav-links .nav-link')
    await expect(navLinks).toHaveCount(7)
  })

  test('should show the download CV button', async ({ page }) => {
    await page.goto('/about')
    const downloadBtn = page.locator('.button__text')
    await expect(downloadBtn).toContainText('My CV')
  })
})
