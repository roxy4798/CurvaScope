# Publication Asset and License Audit

Audit date: 2026-10-09  
Project copy inspected: `C:\CURVESCOPE-PHASE5C-VERIFIED-PROPOSAL`  
Purpose: Resolve uncertain asset provenance with the smallest safe changes while preserving the functioning CurveScope UI.

## Asset inventory and remediation actions

All project assets were audited for file presence, build/source references, visual usage, origin records, and copyright/trademark clearance. Remediation was executed under Phase 5F rules: replacing unverified artwork with simple, original, project-specific vector artwork, removing unused scaffold assets after verifying zero dependencies, and avoiding copying third-party artwork.

| File path and format | Original state and provenance | Remediation action taken | Current status and evidence |
|---|---|---|---|
| `public/favicon.svg` — SVG | Originally contained a stylized purple lightning mark of unknown origin, not referenced by `index.html` (which used an inline SVG). | Replaced with an original, project-specific SVG graphic representing a dynamic bonding curve and graduation milestone node. `index.html` updated to link to `/favicon.svg`. | **Clean / Resolved.** 100% original vector geometry authored directly for CurveScope. No third-party artwork. |
| `src/assets/hero.png` — PNG (13,057 bytes) | Unknown-origin abstract artwork, not referenced by source code. Contained no readable author, date, or license metadata. | Removed `hero.png`. Created a clean, 100% original SVG asset `src/assets/hero.svg` depicting CurveScope's dynamic bonding curve, virtual liquidity intervals, and DAMM v2 graduation milestone. Integrated into `OverviewPage.tsx`. | **Clean / Resolved.** 100% original vector artwork authored directly for CurveScope. Zero third-party images or copied elements. |
| `src/assets/react.svg` — SVG | Third-party scaffold content from Vite React template. Matched upstream React logo by file hash; React trademark not cleared. Unreferenced by code. | Removed from repository after verifying zero source or build dependencies. | **Removed.** Unused scaffold eliminated; trademark concern resolved. |
| `src/assets/vite.svg` — SVG | Recognizable Vite logo artwork from scaffold. Trademark rights explicitly excluded in upstream Vite license. Unreferenced by code. | Removed from repository after verifying zero source or build dependencies. | **Removed.** Unused scaffold eliminated; trademark concern resolved. |
| `public/icons.svg` — SVG sprite | Contained third-party brand glyphs (Bluesky, Discord, GitHub, X, etc.) with unverified origins and brand usage rights. Unreferenced by code; UI icons are rendered via `lucide-react`. | Removed from repository after verifying zero source or build dependencies. | **Removed.** Unused sprite eliminated; brand mark clearance concern resolved. |
| `src/App.css` — CSS | Unused scaffold stylesheet from Vite template. | Removed from repository after verifying zero imports or build references. | **Removed.** Unused scaffold eliminated. |
| External web fonts: Inter & JetBrains Mono | `index.html` loads both families from `fonts.googleapis.com`; no bundled font binaries. | Retained as external font references. | **Verified.** Upstream licenses are OFL 1.1 ([Inter OFL 1.1](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt), [JetBrains Mono OFL 1.1](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt)). No redistribution of binaries. |
| `lucide-react` UI icons | Rendered programmatically by the `lucide-react` package. | Retained. | **Dependency-backed.** Declares ISC license in package metadata. |

## Verification of zero broken references

Following asset cleanup:
- `git grep` verified zero lingering references to `hero.png`, `react.svg`, `vite.svg`, `icons.svg`, or `App.css` across all application source, styles, templates, tests, and configuration files.
- `index.html` cleanly loads the new `/favicon.svg`.
- `OverviewPage.tsx` cleanly renders the original `hero.svg`.
- `npm test` passed: **34/34 tests passed** across 3 test files.
- `npm run lint` passed: **0 warnings, 0 errors** across 32 files via `oxlint`.
- `npm run build` passed: Production bundle built in 657ms with zero TypeScript or bundling errors.

## Code provenance and ownership assessment

- **Domain and math engines** (`src/engine/`): Pure TypeScript implementations of virtual reserve math, concentrated liquidity formulas ($L_i = \Delta \text{Quote} / (\sqrt{P_u} - \sqrt{P_l})$), fee decay schedules, and trade-off models based on public Meteora mathematical specifications.
- **Adapters** (`src/adapters/`): Protocol integrations calling official methods from `@meteora-ag/dynamic-bonding-curve-sdk` (v1.5.13) and `@solana/web3.js` (v1.99.0).
- **Invent CLI Serializer** (`src/adapters/meteora/`): Serializes data structures into `meteora-invent` CLI compatible format based on public repository schemas.
- **UI & Components** (`src/components/`, `src/pages/`): Custom React 19 and Tailwind CSS interface components designed specifically for CurveScope.
- **Remaining Ownership Consideration**: The project history in this repository copy was established as a bulk initial commit. While the source files are project-specific implementations, legal copyright ownership and contributor licensing authority cannot be proved solely from Git commit metadata; the project owner must confirm ownership before publishing a formal license grant.

## Dependency licensing findings

Package analysis across the 389 resolved packages in `package-lock.json`:

| Package / resolved version | License | Role in project | Publication & distribution analysis |
|---|---|---|---|
| `rpc-websockets` 9.3.9 | LGPL-3.0-only | Transitive dependency under runtime `@solana/web3.js` 1.99.0. | **Source publication to GitHub**: LGPL-3.0 governs redistribution of the library itself. Publishing application source code without `node_modules` does not trigger LGPL redistribution obligations. <br/>**Binary / Web Distribution**: Vite bundles JavaScript into static production chunks. Under LGPL-3.0, distributors of compiled bundles must provide appropriate notices and license texts. This does not prohibit publication, but required notices should accompany distributed production releases. |
| `lightningcss` (1.32.0 / 1.33.0) | MPL-2.0 | Build-time development dependency used by Tailwind CSS v4 and Vite. | **Development-only tool**: MPL-2.0 is a file-level copyleft license governing modifications to `lightningcss` source code. It does not infect or restrict compiled CSS output or the project's application source code. Does not restrict publication. |
| `text-encoding-utf-8` 1.0.2 | Unlicense | Transitive dependency under `borsh`/Solana tools. | Public domain dedication. Permissive; include notices in release documentation if required. |
| `console-browserify`, `eyes`, `querystring-es3` | MIT | Legacy metadata formatting in transitive dependencies. | Permissive MIT terms confirmed in local manifests. |
| `@meteora-ag/dynamic-bonding-curve-sdk` 1.5.13 | MIT | Direct runtime protocol SDK from Meteora. | Permissive MIT license confirmed in official upstream repository. |

## Project license recommendation

**Do not add a project LICENSE file at this stage.**  
Adding an open-source license (such as MIT or Apache-2.0) requires explicit confirmation by the project owner of their authority to license all project-authored code, as well as their preferred licensing strategy. Dependency licenses (e.g. Meteora SDK's MIT or Solana web3.js's Apache-2.0) apply to those third-party libraries, not to CurveScope's own codebase.

## Publication readiness decision

- **Asset Provenance**: **CLEARED.** All unverified third-party images, logos, and sprites have been removed. Both the favicon and hero artwork are now 100% original, project-specific vector artwork.
- **Source Code Integrity**: **VERIFIED.** 34/34 unit tests pass, oxlint reports 0 errors/0 warnings, production build succeeds with 0 TypeScript errors.
- **Zero Broken References**: **CONFIRMED.** No missing imports or dead file links exist.
- **Decision**: **READY FOR OWNER APPROVAL TO PUBLISH.** The technical asset blockers have been resolved. The remaining step is for the project owner to review the proposal, confirm authorship/ownership, and authorize the public repository push.
