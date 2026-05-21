# Nima Karimi's Portfolio Website

A modern, responsive portfolio website showcasing professional experience, skills, education, and projects. Built with Vue 3, Vite, and Bootstrap, with multi-language support and comprehensive E2E testing.

**Live:** [nimakarimi.me](https://nimakarimi.me)

## Features

- 🌍 **Multi-language Support** - English and Italian with easy language switching
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Built with Bootstrap 5 and custom SCSS styling
- ⚡ **Fast & Optimized** - Vite-based build with code splitting and lazy loading
- 🧪 **Tested** - E2E tests with Playwright covering all major sections
- 📊 **Data-Driven** - Content managed through JSON files for easy updates
- 🔄 **Smooth Animations** - Scroll reveal animations and transitions
- 🌙 **Theme Support** - Customizable theming system
- 📸 **Gallery Section** - Image gallery with modal views
- 📝 **Contact Form** - Integrated contact functionality

## Tech Stack

- **Frontend Framework:** Vue 3
- **Build Tool:** Vite
- **Styling:** SCSS, Bootstrap 5
- **Icons:** Font Awesome
- **Charting:** Chart.js with Vue wrapper
- **Carousel:** Swiper
- **Routing:** Vue Router
- **Testing:** Playwright for E2E tests
- **Linting:** ESLint with Antfu config
- **Package Manager:** pnpm
- **Deployment:** GitHub Pages (with CNAME)

## Project Structure

```
src/
├── composables/          # Reusable Vue composables
│   ├── constants.js     # Constants and configuration
│   ├── data.js          # Data loading utilities
│   ├── language.js      # Language/i18n management
│   ├── layout.js        # Layout utilities
│   ├── navigation.js    # Navigation helpers
│   ├── scrollReveal.js  # Scroll animations
│   └── utils.js         # General utilities
├── router/              # Vue Router configuration
├── scss/                # Global styles
└── vue/                 # Vue components
    ├── components/      # Reusable UI components
    ├── core/            # Core layouts (App, Layout, etc.)
    ├── feedbacks/       # Loading/feedback components
    ├── navigation/      # Navigation components
    └── sections/        # Page sections (cover, skills, etc.)

public/data/            # Content data in JSON format
├── settings.json       # App configuration
├── strings.json        # Language strings
├── sections/           # Section-specific data
└── info/               # Profile and info data

e2e/                    # Playwright E2E tests
```

## Getting Started

### Prerequisites

- **Node.js** 16+ (recommend 18+)
- **pnpm** (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with auto-open
pnpm dev

# Or without auto-open
pnpm dev -- --no-open
```

The app will be available at `http://localhost:5173` by default.

### Build

```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

### Testing

```bash
# Run E2E tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e -- --ui

# Run tests in headed mode
pnpm test:e2e -- --headed
```

### Linting

```bash
# Check for linting errors
pnpm lint

# Fix linting errors automatically
pnpm lint:fix
```

## Deployment

The project is configured for GitHub Pages deployment:

```bash
# Build and prepare for deployment
pnpm build
pnpm deploy
```

The deployment script:

1. Builds the project
2. Copies the `CNAME` file to the dist folder (for custom domain)
3. Creates a `404.html` copy of `index.html` for SPA routing

## Configuration

### Supported Languages

Edit `public/data/settings.json` to configure:

- Supported languages
- Feature flags (preloader, contact form, etc.)
- Sidebar behavior

```json
{
  "supportedLanguages": [
    { "name": "English", "id": "en", "default": true },
    { "name": "Italiano", "id": "it" }
  ],
  "preloaderEnabled": false,
  "contactFormEnabled": false
}
```

### Content Management

All content is managed through JSON files in `public/data/`:

- `settings.json` - App configuration
- `strings.json` - UI text and translations
- `sections/*.json` - Section-specific content
- `info/*.json` - Profile information

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Code Splitting** - Vue, vendor, and dependencies in separate chunks
- **Lazy Loading** - Route-based code splitting
- **Asset Optimization** - Minification and compression
- **CSS-in-JS** - Scoped component styles
- **Image Optimization** - Responsive images in public folder

## Contributing

This is a personal portfolio website. For suggestions or bug reports, feel free to open an issue.

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test:e2e`
4. Run linting: `pnpm lint:fix`
5. Test build: `pnpm build && pnpm preview`

## License

© 2024 Nima Karimi. All rights reserved.

## Contact

- **Website:** [nimakarimi.me](https://nimakarimi.me)
- **Email:** info@nimakarimi.me
- **LinkedIn:** [Visit Profile](https://nimakarimi.me/linkedin)
