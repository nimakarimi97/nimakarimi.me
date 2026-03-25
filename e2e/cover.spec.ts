import { expect, test } from '@playwright/test'

test.describe('Cover Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the welcome title', async ({ page }) => {
    const coverTitle = page.locator('.cover-title')
    await expect(coverTitle).toContainText('Welcome')
    await expect(coverTitle).toContainText('Résumé')
  })

  test('should display the bio text', async ({ page }) => {
    const bio = page.locator('.cover-description')
    await expect(bio).toContainText('Full-stack Web Developer')
    await expect(bio).toContainText('Project Manager')
  })

  test('should display contact info inline list', async ({ page }) => {
    const inlineList = page.locator('#about .inline-list')
    await expect(inlineList).toBeVisible()
    await expect(inlineList.locator('.list-item')).toHaveCount(2)
  })

  test('should display social links', async ({ page }) => {
    const socialLinks = page.locator('#about .social-links .btn-social')
    await expect(socialLinks).toHaveCount(3)
  })

  test('should have working social link hrefs', async ({ page }) => {
    const linkedinLink = page.locator('#about .social-links a[href="/linkedin"]')
    await expect(linkedinLink).toBeVisible()

    const githubLink = page.locator('#about .social-links a[href="/github"]')
    await expect(githubLink).toBeVisible()
  })
})
