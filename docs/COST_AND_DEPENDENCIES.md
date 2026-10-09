# Zero-Cost Commitment & Dependencies Specification

**Policy**: Strict 100% Free / Zero-Subscription Operation  
**Verification Date**: October 2026  
**Compliance**: Fully Compliant with Section 8 Zero-Cost Mandate  

---

## 1. Zero-Cost Policy Enforcement Matrix

CurveScope was designed and implemented under an unconditional zero-cost architecture:

| Expense Category | Standard Web3 SaaS | CurveScope Architecture | Cost |
| :--- | :--- | :--- | :--- |
| **AI / Synthesis APIs** | OpenAI / Anthropic API keys | Local deterministic algorithms in pure TypeScript (`src/engine/`) | **$0.00** |
| **Solana RPC Services** | QuickNode / Helius paid tier ($49-$299/mo) | Public Solana RPC clusters (`api.mainnet-beta.solana.com`, `api.devnet.solana.com`) with bounded timeouts & offline mode | **$0.00** |
| **Market Data APIs** | CoinGecko / Birdeye Pro API ($99/mo) | Closed deterministic concentrated liquidity reserve math | **$0.00** |
| **Database & Auth** | Supabase / DynamoDB / Clerk Auth | Client-side `localStorage` + downloadable JSON/CSV files | **$0.00** |
| **Hosting & CDN** | AWS / Vercel Pro | Cloudflare Pages / GitHub Pages free static hosting tier | **$0.00** |
| **UI Components** | Paid Tailwind UI / Catalyst kits | Open-source Tailwind CSS v4 + Lucide React | **$0.00** |
| **Transaction Fees** | Mainnet SOL gas fees | Read-only inspection; configuration export to Meteora Invent CLI | **$0.00** |
| **Total Operating Cost** | $250 - $1,000 / month | Zero Recurring Subscriptions | **$0.00 / mo** |

---

## 2. External Services & Operational Limits

### Solana Public RPC Endpoints
- **Endpoints Used**:
  - Mainnet: `https://api.mainnet-beta.solana.com`
  - Devnet: `https://api.devnet.solana.com`
  - Custom: Optional user-supplied RPC endpoint (free or self-hosted)
- **Rate Limits & Safeguards**:
  - Public Solana RPCs enforce rate limits (typically ~40 requests/10s).
  - CurveScope uses bounded HTTP requests with an 8-second abort signal (`AbortController`).
  - If a 429 rate limit is encountered, CurveScope catches the error and displays a clear diagnostic message without crashing the UI.
  - The entire core workflow (Profile Builder, Recipe Synthesis, Scenario Comparison, Invent Export) functions **100% offline** without any network connection.

### Static Hosting
- **Target**: Cloudflare Pages / GitHub Pages / Netlify Free
- **Build Output**: Static assets compiled into `/dist` via `npm run build`.

---

## 3. Itemized Dependency Audit & Open-Source Licenses

Every dependency in `package.json` is free open-source software with verified permissive licenses:

| Dependency | Version | License | Justification |
| :--- | :--- | :--- | :--- |
| `react` / `react-dom` | `^19.2.8` | MIT | Core UI component framework |
| `@meteora-ag/dynamic-bonding-curve-sdk` | `^1.5.13` | MIT | Official Meteora DBC TypeScript SDK |
| `@solana/web3.js` | `^1.99.0` | MIT | Solana address validation and public RPC connection |
| `bn.js` | `^5.2.5` | MIT | Big integer math required by Solana & DBC IDLs |
| `decimal.js` | `^10.6.0` | MIT | Arbitrary-precision decimal calculations |
| `recharts` | `^3.10.1` | MIT | Analytical bonding curve and comparison visualization |
| `react-is` | `^19.2.8` | MIT | Peer dependency of Recharts element inspection |
| `lucide-react` | `^1.54.0` | ISC | Developer-focused interface icons |
| `tailwindcss` | `^4.3.3` | MIT | Utility-first responsive design system |
| `@tailwindcss/vite` | `^4.3.3` | MIT | Vite plugin for Tailwind v4 |
| `vite` | `^8.3.0` | MIT | Next-generation frontend build tool |
| `vite-plugin-node-polyfills` | `^0.28.0` | MIT | Browser polyfills for Buffer, Crypto, and BN.js |
| `vitest` | `^5.0.3` | MIT | High-performance deterministic unit test runner |
| `typescript` | `~5.8.2` | Apache-2.0 | Type safety and strict mode validation |
