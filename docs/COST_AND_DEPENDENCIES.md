# Cost and Dependency Notes

Reviewed: 2026-10-09. Versions below reflect package metadata and the checked-in lockfile at review time; they do not guarantee that future versions or hosted services remain free.

## Operating cost and network use

The core local planning workflow has no mandatory paid API, database, authentication service, RPC provider, wallet, or transaction. Requirements intake, local recipe calculations, comparisons, and readiness checks run in the client. Optional read-only account inspection requires a user-selected public or custom RPC endpoint and may fail or be rate-limited. Invent configuration export is disabled; no executable Invent configuration or pool transaction is produced.

CurveScope has not been deployed. Cloudflare Pages, GitHub Pages, and Netlify are possible hosting options, but no provider, free-tier terms, or deployment has been verified. Hosting availability and terms can change. The project does not claim a universal zero total cost.

The application does not sign transactions or use a wallet. No mainnet execution is implemented. Optional public RPC availability and limits are controlled by endpoint operators.

## Direct dependency metadata

The following are package metadata license expressions recorded during review. This inventory is not a legal opinion or a license grant for CurveScope's own code and assets.

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

The lockfile contains transitive packages with additional license expressions, including LGPL-3.0-only (`rpc-websockets`) and MPL-2.0 (`lightningcss` variants), alongside MIT, Apache-2.0, ISC, BSD, and 0BSD expressions. This metadata-level inventory is not a complete upstream license-text or legal compatibility audit.

## Project license and asset rights

This repository does not currently include a project-wide `LICENSE` file. Third-party dependency licenses do not automatically grant a license to CurveScope's own source or assets. No project-wide reuse permission is implied. The owner should confirm rights and attribution for project-authored materials and any third-party assets before choosing a license.

The HTML references Inter and JetBrains Mono through Google Fonts rather than bundling font binaries. This means the hosted UI may contact Google Fonts when those resources are loaded; this is a network/privacy consideration for hosted use.
