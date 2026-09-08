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

  // Verify hero profile card is visible
  const profileCard = page.locator('.hero-profile-card')
  await expect(profileCard).toBeVisible()

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
})

test('hero photo card does not disappear or flicker on page load', async ({ page }) => {
  await page.addInitScript(() => {
    window.__minCardOpacity = 1
    const check = () => {
      const card = document.querySelector('.hero-profile-card')
      if (card) {
        const op = Number.parseFloat(window.getComputedStyle(card).opacity)
        if (op < window.__minCardOpacity) {
          window.__minCardOpacity = op
        }
      }
    }
    setInterval(check, 16)
  })

  await page.goto('/partners')
  await page.waitForTimeout(1000)

  const minOpacity = await page.evaluate(() => window.__minCardOpacity)
  expect(minOpacity).toBe(1)
})
