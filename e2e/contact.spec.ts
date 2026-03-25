import { expect, test } from '@playwright/test'

test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the contact section title', async ({ page }) => {
    const section = page.locator('#contact')
    await expect(section).toBeVisible()
    await expect(section.locator('.section-title')).toContainText('Contact')
  })

  test('should display contact items', async ({ page }) => {
    const section = page.locator('#contact')
    await expect(section).toContainText('E-mail')
    const contactItems = section.locator('.col-12')
    const count = await contactItems.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('should display email address', async ({ page }) => {
    const section = page.locator('#contact')
    await expect(section).toContainText('info@nimakarimi.me')
  })

  test('should display address', async ({ page }) => {
    const section = page.locator('#contact')
    await expect(section).toContainText('Milan, Italy')
  })

  test('should have a mailto link for email', async ({ page }) => {
    const emailLink = page.locator('#contact a.muted[href="mailto:info@nimakarimi.me"]')
    await expect(emailLink).toBeVisible()
  })

  test('should display copy button for email', async ({ page }) => {
    const copyButton = page.locator('#contact .copy-button')
    await expect(copyButton).toBeVisible()
  })

  test('should copy email when copy button is clicked', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const copyButton = page.locator('#contact .copy-button').first()
    await copyButton.click()

    const checkIcon = page.locator('#contact .fa-check')
    await expect(checkIcon).toBeVisible()
  })
})
