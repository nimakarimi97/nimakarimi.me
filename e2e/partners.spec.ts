import { expect, test } from '@playwright/test'

test('partners landing page renders all elements cleanly', async ({ page }) => {
  await page.goto('/partners')

  // Wait for networkidle
  await page.waitForLoadState('networkidle')

  // Verify page title / heading is visible
  const headline = page.locator('.hero-headline')
  await expect(headline).toBeVisible()

  // Verify profile name is visible
  const profileName = page.locator('.profile-name')
  await expect(profileName).toBeVisible()

  // Verify qualifier section cards are visible
  const qualifierCards = page.locator('.qualifier-card')
  await expect(qualifierCards).toHaveCount(4)
  for (let i = 0; i < 4; i++) {
    await expect(qualifierCards.nth(i)).toBeVisible()
  }

  // Verify offer cards are visible
  const offerCards = page.locator('.offer-card')
  await expect(offerCards).toHaveCount(3)
  for (let i = 0; i < 3; i++) {
    await expect(offerCards.nth(i)).toBeVisible()
  }

  // Verify contact form is visible
  const contactCard = page.locator('.contact-card')
  await expect(contactCard).toBeVisible()

  // Take screenshot for visual verification
  await page.screenshot({ path: '/Users/nkarimi/.gemini/antigravity/brain/72101145-dc86-4411-badc-edac1a1ab9c7/partners_e2e_screenshot.png', fullPage: true })
})
