import { expect, test } from '@playwright/test'

test.describe('Education Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the education section title', async ({ page }) => {
    const section = page.locator('#education')
    await expect(section).toBeVisible()
    await expect(section.locator('.section-title')).toContainText('Education')
  })

  test('should display both education entries', async ({ page }) => {
    const timelineItems = page.locator('#education .timeline-item:not(.timeline-item-tail)')
    await expect(timelineItems).toHaveCount(2)
  })

  test('should show Master degree as the most recent (first item)', async ({ page }) => {
    const firstItem = page.locator('#education .timeline-item').first()
    await expect(firstItem.locator('.timeline-item-title')).toContainText('Master of Science')
  })

  test('should show Bachelor degree entry', async ({ page }) => {
    const items = page.locator('#education .timeline-item:not(.timeline-item-tail)')
    const lastItem = items.last()
    await expect(lastItem.locator('.timeline-item-title')).toContainText('Bachelor of Science')
  })

  test('should display university names', async ({ page }) => {
    const subtitles = page.locator('#education .timeline-item-subtitle')
    await expect(subtitles.first()).toContainText('Padova')
    await expect(subtitles.last()).toContainText('Toosi')
  })

  test('should display thesis information in descriptions', async ({ page }) => {
    const descriptions = page.locator('#education .timeline-item-content-body')
    const firstDesc = descriptions.first()
    await expect(firstDesc).toContainText('Thesis')
  })
})
