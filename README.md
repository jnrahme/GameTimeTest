# GameTime Order History Mobile

[![CI](https://github.com/jnrahme/GameTimeTest/actions/workflows/ci.yml/badge.svg)](https://github.com/jnrahme/GameTimeTest/actions/workflows/ci.yml)
![React Native](https://img.shields.io/badge/React%20Native-0.85.3-66FAC8?labelColor=1C1C20)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-56-66FAC8?labelColor=1C1C20)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-66FAC8?labelColor=1C1C20)
![Node](https://img.shields.io/badge/Node-22-66FAC8?labelColor=1C1C20)
![Coverage Gate](https://img.shields.io/badge/coverage%20gate-95%25%20lines%20%7C%2080%25%20branches-66FAC8?labelColor=1C1C20)
![License](https://img.shields.io/badge/license-MIT-66FAC8?labelColor=1C1C20)

Find the receipt. Share the night. Keep the group moving.

An Expo React Native mobile app for viewing past GameTime-style ticket
purchases, opening a receipt detail screen, and generating a share-ready
calendar event for friends. The implementation is deliberately mobile-first,
brand-aligned, rotation-aware, typed, tested, and reviewable.

Reviewer-facing line: a compact take-home prompt treated like a production
feature branch.

## Screenshots

These are not decorative mocks. They are generated from the working app and kept
in the repo as review assets.

| Portrait | Landscape |
| --- | --- |
| ![GameTime order history portrait](docs/screenshots/order-history-portrait.png) | ![GameTime order history landscape](docs/screenshots/order-history-landscape.png) |

## Implementation Showcase

Open the hosted implementation website at
[jnrahme.github.io/GameTimeTest](https://jnrahme.github.io/GameTimeTest/).
It explains the architecture, product tradeoffs, MCP/skills setup, AGENTS.md
rules, quality gates, rotation-aware design decisions, and GitHub repo polish.

## Run Locally

```bash
nvm install 22
nvm use
npm ci
npm run ios
```

Android is available with `npm run android`. A browser preview is available with
`npm run web`, but the implementation is mobile-first React Native.

## Build & Verify

Entry point: [Makefile](Makefile).

```bash
nvm use
make verify
make expo-check
```

`make verify` runs TypeScript in strict mode plus the Jest suite with coverage
thresholds: 95% statements, 95% lines, 90% functions, and 80% branches.
`make expo-check` verifies Expo SDK package compatibility.

## Architecture

```mermaid
flowchart TB
  Prompt[Take-home prompt] --> Schema[Zod runtime schemas]
  Schema --> Domain[Domain types, selectors, formatters]
  Domain --> API[Mock orders API boundary]
  API --> Controller[useOrdersController]
  Controller --> List[FlashList order timeline]
  Controller --> Detail[OrderDetailScreen]
  Detail --> Share[ICS generation + native share]
  App[App error boundary + safe areas] --> Controller
  Theme[GameTime design tokens] --> List
  Theme --> Detail
```

- `src/domain/orders`: Zod runtime schemas, inferred TypeScript types,
  formatting, selectors, and calendar invite generation.
- `src/services`: validated mock network boundary for `GET /orders` and
  `GET /orders/:orderId`, plus native/web share integration.
- `src/features/orders`: screen-level state orchestration and mobile-first React
  Native presentation with FlashList virtualization and pull-to-refresh.
- `src/components` and `src/theme`: reusable UI primitives, app error boundary,
  and semantic GameTime design tokens.

The UI follows the current `gametime.co` black, white, and mint visual language
while presenting a more receipt-focused mobile workflow. It is designed for
native phone ergonomics first: safe areas, rotation-aware portrait/landscape
layouts, 44px+ touch targets, accessible press labels, native share integration,
and responsive layouts that also hold up in Expo's web preview.

## Verification Loop

```mermaid
flowchart LR
  Rules[AGENTS.md + Node 22] --> Build[Expo React Native implementation]
  Build --> Verify[make verify]
  Verify --> Coverage[42 tests + coverage gate]
  Coverage --> ExpoCheck[make expo-check]
  ExpoCheck --> Screens[Portrait + landscape screenshots]
  Screens --> CI[GitHub Actions CI]
```

## Professional Repo Surface

The repo is structured so the public GitHub page communicates quality before a
reviewer even opens the source:

- Truthful badges for CI, Node 22, Expo SDK 56, React Native, TypeScript, and MIT.
- Community health files: [Code of Conduct](CODE_OF_CONDUCT.md),
  [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [License](LICENSE),
  and [.github/CODEOWNERS](.github/CODEOWNERS).
- Repeatable local and CI verification through `make verify`,
  `make expo-check`, and [.github/workflows/ci.yml](.github/workflows/ci.yml).
- Public repo metadata guidance in [docs/REPO_PROFILE.md](docs/REPO_PROFILE.md).
- Screenshot-backed documentation and a hosted implementation showcase.

## Tradeoffs

- Navigation is local state instead of a routing library because the prompt needs
  two screens, not deep linking; Android hardware back is still handled for the
  detail view.
- Calendar sharing generates standards-friendly ICS content and uses native/web
  share APIs when available, with clipboard fallback on web.
- Network calls are simulated with a mock API so the data boundary is easy to
  replace with a real backend.
- Tests cover high-risk domain behavior, API validation, controller state,
  sharing fallbacks, list/detail interactions, app shell behavior, and error
  recovery.
