# Contributing

Thanks for taking the time to review or improve this project. The goal is to
keep the app small, polished, and easy to reason about.

## Local Setup

```bash
nvm install 22
nvm use
npm ci
```

Run the app with:

```bash
npm run ios
npm run android
npm run web
```

## Quality Bar

Before opening a pull request or pushing a material change, run:

```bash
npm run format
make verify
make expo-check
```

`make verify` runs strict TypeScript, ESLint, and the Jest suite with coverage
gates. `npm run format` applies Prettier (CI enforces formatting via
`npm run format:check`). `make expo-check` verifies that installed package
versions match Expo SDK 56 expectations.

## Engineering Principles

- Keep business behavior in `src/domain` where it can be tested without UI.
- Keep network and platform integration behind `src/services` boundaries.
- Keep screens focused on composition and user interaction.
- Prefer accessible React Native primitives with clear labels and 44pt+ touch
  targets.
- Use the existing theme tokens rather than hardcoded per-screen colors.
- Load remote images through `CachedImageBackground` (expo-image) so artwork is
  cached and shows a placeholder instead of a blank frame.
- Cap font scaling on large display text with `typography.displayMaxScale`, and
  leave body text free to scale for accessibility.
- Add tests when behavior changes or a contract becomes easier to regress.

## Pull Request Checklist

- The change is scoped to the prompt or a clearly documented improvement.
- README/docs updates are included when behavior, setup, or architecture changes.
- Screenshots are refreshed when visual layout changes materially.
- `make verify` and `make expo-check` have been run locally.
