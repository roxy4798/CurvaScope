# Cost and Dependency Notes

**Reviewed:** 2026-10-09. Versions below are those resolved in the checked-in lockfile and installed local dependency tree at review time; this is not a promise that future versions or hosted services remain available at no cost.

## Operating cost and network use

The local planning workflow has no mandatory paid API, database, authentication service, RPC provider, wallet, or transaction. Requirements intake, local recipe calculations, comparisons, and readiness checks can be used without a network connection. Optional read-only account inspection requires a user-selected public or custom RPC endpoint and can fail or be rate-limited. Invent configuration export is disabled; no Invent CLI configuration or pool transaction is produced.

CurveScope has not been deployed. Cloudflare Pages, GitHub Pages, and Netlify were considered as possible static-hosting options, but no provider, free-tier terms, or deployment has been verified. Hosting availability and terms can change. A user's computer, internet access for optional RPC, or any future hosting choice may have costs; the project does not claim a universal zero total cost or a hackathon â€œzero-cost mandate.â€

The local application does not sign transactions or use a wallet. No mainnet execution is implemented. Public RPC calls are optional and their availability and limits are controlled by their operators.

## Direct dependency metadata

The following are the resolved direct versions and license expressions declared by their installed package metadata during this review. They are dependency inventory evidence, not a legal opinion or a grant of rights to CurveScope's own code and assets.

| Package | Resolved version | Package metadata license |
|---|---:|---|
| `@meteora-ag/dynamic-bonding-curve-sdk` | 1.5.13 | MIT |
| `@solana/web3.js` | 1.99.0 | MIT |
| `bn.js` | 5.2.5 | MIT |
| `decimal.js` | 10.6.0 | MIT |
| `lucide-react` | 1.54.0 | ISC |
| `react` | 19.3.0 | MIT |
| `react-dom` | 19.3.0 | MIT |
| `react-is` | 19.3.0 | MIT |
| `recharts` | 3.10.1 | MIT |
| `@tailwindcss/vite` | 4.3.3 | MIT |
| `@types/bn.js` | 5.2.0 | MIT |
| `@types/node` | 24.19.1 | MIT |
| `@types/react` | 19.3.0 | MIT |
| `@types/react-dom` | 19.3.0 | MIT |
| `@vitejs/plugin-react` | 6.1.2 | MIT |
| `oxlint` | 1.87.0 | MIT |
| `tailwindcss` | 4.3.3 | MIT |
| `typescript` | 5.8.3 | Apache-2.0 |
| `vite` | 8.3.4 | MIT |
| `vite-plugin-node-polyfills` | 0.28.0 | MIT |
| `vitest` | 5.0.3 | MIT |

The lockfile contains 389 package entries. Four use legacy or absent singular SPDX `license` metadata: `console-browserify`, `eyes`, `querystring-es3`, and `text-encoding-utf-8`. Installed package manifests/license files identify MIT terms for the first three and an Unlicense dedication for `text-encoding-utf-8`; see [PUBLICATION_ASSET_LICENSE_AUDIT.md](PUBLICATION_ASSET_LICENSE_AUDIT.md). Other recorded expressions include LGPL-3.0-only (`rpc-websockets`) and MPL-2.0 (`lightningcss` and platform variants), as well as MIT, Apache-2.0, ISC, BSD, and 0BSD expressions. This metadata-level review is not a complete upstream license-text or legal compatibility audit.

## Project license and asset rights

This project currently has no `LICENSE` file or package license field. No project-wide license is recommended yet: repository history alone does not establish ownership or originality for all source files, the hero image and icon assets have unresolved provenance, and third-party dependency obligations have not had a complete legal review. The owner must establish authority over the project materials and clear the assets before choosing a project license. No license is implied for CurveScope code by the dependency licenses.

| File | Classification and evidence | Remaining issue |
|---|---|---|
| `public/favicon.svg` | Original vector graphic authored specifically for CurveScope representing dynamic bonding curve geometry. Linked in `index.html`. | Clean. 100% original project-specific artwork. |
| `src/assets/hero.svg` | Original vector graphic authored specifically for CurveScope representing virtual reserve curve intervals and graduation milestones. Displayed in `OverviewPage.tsx`. | Clean. 100% original project-specific artwork. |
| `src/assets/react.svg` | Unused third-party scaffold asset from Vite React template. | Removed from repository; zero dependencies. |
| `src/assets/vite.svg` | Unused third-party scaffold asset representing Vite logo. | Removed from repository; zero dependencies. |
| `public/icons.svg` | Unused SVG icon sprite containing third-party brand marks. | Removed from repository; UI uses `lucide-react`. |
| `src/assets/hero.png` | Unused unknown-origin PNG artwork. | Removed from repository; replaced by `hero.svg`. |
| Fonts | No font files are bundled; `index.html` loads Inter and JetBrains Mono from Google Fonts. | Both families have upstream OFL 1.1 evidence. External font requests remain a hosted-app privacy consideration. |

CurveScope source files have one bulk snapshot commit rather than per-file history or source citations. Its commit author field is evidence of the recorded Git identity, not independent proof of authorship or originality. See [PUBLICATION_ASSET_LICENSE_AUDIT.md](PUBLICATION_ASSET_LICENSE_AUDIT.md) for asset-by-asset findings and [PROJECT_HISTORY_AND_DISCLOSURE.md](PROJECT_HISTORY_AND_DISCLOSURE.md) for the project timeline limits.

