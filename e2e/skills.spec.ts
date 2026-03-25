import { expect, test } from '@playwright/test'

test.describe('Skills Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the skills section title', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toBeVisible()
    await expect(section.locator('.section-title')).toContainText('Skill')
  })

  test('should display skills section description', async ({ page }) => {
    const description = page.locator('#skills .section-header .lead')
    await expect(description).toContainText('skills')
  })

  test('should display programming subcategory', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('Programming')
  })

  test('should display languages subcategory', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('Languages')
  })

  test('should display bonus skills subcategory', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('Bonus Skills')
  })

  test('should list programming skills', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('JavaScript')
    await expect(section).toContainText('Vue 3')
    await expect(section).toContainText('Node JS')
    await expect(section).toContainText('Go')
    await expect(section).toContainText('Docker')
  })

  test('should list language skills', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('Persian')
    await expect(section).toContainText('English')
    await expect(section).toContainText('Italian')
    await expect(section).toContainText('Spanish')
  })

  test('should display ability items', async ({ page }) => {
    const section = page.locator('#skills')
    await expect(section).toContainText('Project Management')
    await expect(section).toContainText('Team Leadership')
    await expect(section).toContainText('Full-Stack Development')
  })
})
