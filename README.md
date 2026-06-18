# GameTime Order History Mobile

An Expo React Native mobile app for viewing past ticket purchases, opening a receipt detail screen, and generating a share-ready calendar event for friends.

## Run Locally

```bash
nvm install 22
nvm use
npm install
npm run ios
```

Android is available with `npm run android`. A browser preview is available with `npm run web`, but the implementation is mobile-first React Native.

## Verify

```bash
nvm use
npm run verify
```

`verify` runs TypeScript in strict mode and the Jest test suite.

## Screenshots

| Portrait | Landscape |
| --- | --- |
| ![GameTime order history portrait](docs/screenshots/order-history-portrait.png) | ![GameTime order history landscape](docs/screenshots/order-history-landscape.png) |

## Architecture

- `src/domain/orders`: prompt-aligned TypeScript entities, formatting, selectors, and calendar invite generation.
- `src/services`: mock network boundary for `GET /orders` and `GET /orders/:orderId`, plus share integration.
- `src/features/orders`: screen-level state orchestration and mobile-first React Native presentation.
- `src/components` and `src/theme`: reusable UI primitives and design tokens.

The UI follows the current `gametime.co` black, white, and mint visual language while presenting a more receipt-focused mobile workflow. It is designed for native phone ergonomics first: safe areas, rotation-aware portrait/landscape layouts, 44px+ touch targets, accessible press labels, native share integration, and responsive layouts that also hold up in Expo's web preview. Network calls are simulated with a mock API so the data boundary is easy to replace with a real backend.

## Tradeoffs

- Navigation is local state instead of a routing library because the prompt needs two screens, not deep linking.
- Calendar sharing generates standards-friendly ICS content and uses native/web share APIs when available, with clipboard fallback on web.
- Tests focus on domain behavior and API boundaries where regressions would be most costly.
