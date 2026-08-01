# Project Instructions

## Package Manager

This project uses **pnpm** as the package manager. Always use `pnpm` instead of `npm` or `yarn`.

### Common Commands

- Development: `pnpm run dev`
- Build: `pnpm run build`
- Tests (E2E): `pnpm run test:e2e`
- Linting: `pnpm run lint`
- Linting with fixes: `pnpm run lint:fix`
- Preview: `pnpm run preview`

### Installation

When installing new packages, use:

```bash
pnpm add <package-name>
pnpm add -D <package-name>  # for devDependencies
```

Do not use `npm install` or `yarn add`.
