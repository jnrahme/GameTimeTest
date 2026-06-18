# Agent Guide

Instructions for AI agents and contributors working in this repository. Keep
changes small, typed, tested, and consistent with the patterns described below.

## Setup and commands

- Use **Node 22** via `nvm use` (`.nvmrc` tracks the latest Node 22 line, and
  `engines` pins `>=22.13.0 <23`). Install dependencies with `npm ci`.
- Consult the **Expo SDK 56** documentation
  (https://docs.expo.dev/versions/v56.0.0/) before modifying any Expo or React
  Native behavior. Add native dependencies with `npx expo install` rather than a
  bare `npm install`, so versions remain SDK-compatible.
- Run the application with `npm run ios`, `npm run android`, or `npm run web`.
- Keep the following commands green before every pull request or material change:
  - `npm run verify` — strict `tsc --noEmit`, ESLint, then Jest with coverage.
  - `npm run format` — apply Prettier formatting (CI enforces it via
    `npm run format:check`).
  - `make expo-check` — confirms installed versions match Expo SDK 56.
- Coverage thresholds are enforced (branches 80, functions 90, lines and
  statements 95). Add tests to meet them rather than lowering the thresholds.

## Architecture and layering

Dependencies point downward only; a layer must not reference the layers above it.

```
App.tsx (QueryClientProvider + error boundary)
  OrdersExperience            navigation.ts — NavigationContainer + native stack
    Container components       connect TanStack Query hooks and navigation params
      Screen components        presentational, props-in, no data fetching
  features/orders/queries.ts  server-state hooks (useOrders / useOrder)
  services/ordersApi.ts       mock API boundary that validates with Zod
  domain/orders/*             pure: schema, inferred types, selectors, formatters
  components/ + theme/        UI primitives and design tokens
```

- The `domain/` layer is pure: it contains no React and no I/O, so business
  logic remains unit-testable without a renderer.
- Zod is the single source of truth. `schema.ts` defines the runtime contract
  and `types.ts` infers the domain types from it. Edit the schema, not the types.
- Validate at the boundary. `ordersApi` parses responses through the schema so
  untrusted data never enters the domain untyped.
- Server data is not component state. Fetching, caching, retry, and refetch are
  owned by TanStack Query (`queries.ts`); screens receive data through container
  props.
- Screens are presentational. Containers own data and navigation, while screens
  own layout and interaction, which keeps screens straightforward to test.
- Pass identifiers as typed route params, not globals. `orderId` travels through
  the navigation route defined in `navigation.ts`, which also enables `gametime://`
  deep links.

## Conventions

- Use the design tokens in `src/theme/tokens.ts` rather than hardcoded
  per-screen colors.
- Store and pass monetary values as integer cents, and format them only at the
  edge with `formatMoney`. Represent dates as ISO strings.
- Accessibility is required: provide meaningful `accessibilityLabel` and
  `accessibilityRole` values on interactive elements, and maintain touch targets
  of at least 44pt.
- Follow the testing pyramid: cover pure logic in `domain/` with unit tests for
  each path, and cover hooks, containers, and screens with behavior tests using
  React Testing Library. Mock only at the API and native-module boundaries, never
  internal modules.
- Keep the project focused on its purpose: typed mock API boundaries, accessible
  React Native UI, and tests for order and sharing behavior.
