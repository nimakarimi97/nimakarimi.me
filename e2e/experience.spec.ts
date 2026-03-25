import { expect, test } from '@playwright/test'

test.describe('Experience Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the experience section title', async ({ page }) => {
    const section = page.locator('#experience')
    await expect(section).toBeVisible()
    await expect(section.locator('.section-title')).toContainText('Experience')
  })

  test('should display all experience timeline items', async ({ page }) => {
    const timelineItems = page.locator('#experience .timeline-item:not(.timeline-item-tail)')
    await expect(timelineItems).toHaveCount(5)
  })

  test('should show the most recent experience first (Capgemini)', async ({ page }) => {
    const firstItem = page.locator('#experience .timeline-item').first()
    await expect(firstItem.locator('.timeline-item-title')).toContainText('Software Engineering Consultant')
  })

  test('should display company logos', async ({ page }) => {
    const logos = page.locator('#experience .timeline-item-img')
    const count = await logos.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display skill tags on experience items', async ({ page }) => {
    const skillTags = page.locator('#experience .timeline-item').first().locator('.skill-item')
    const count = await skillTags.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display date ranges for each experience', async ({ page }) => {
    const dates = page.locator('#experience .timeline-item:not(.timeline-item-tail)')
    const count = await dates.count()
    for (let i = 0; i < count; i++) {
      const dateTag = dates.nth(i).locator('.fa-calendar').first()
      await expect(dateTag).toBeVisible()
    }
  })
})
