# CurveScope Architecture Specification

**Product Direction**: Asset Launch Recipe Lab for Meteora DBC & DAMM v2  
**Platform Target**: Solana / Meteora Protocol  
**Repository Structure**: Monorepo / React + Vite + TypeScript Strict Mode  

---

## 1. High-Level System Architecture

CurveScope is structured as a **deterministic, local-first analytical lab**. All economic simulations, parameter synthesis, and protocol validations run client-side without proprietary backend servers or paid APIs.

```mermaid
graph TD
    A[Builder Requirements Intake] --> B[Launch Profile Wizard]
    B --> C[Protocol Validation Engine]
    B --> D[Pure Virtual Reserve Engine]
    D --> E[Curve Segment Generator]
    D --> F[Fee & Decay Engine]
    D --> G[Trade-Off Scoring Engine]
    C --> H[Validated DBC Recipe]
    E --> H
    F --> H
    G --> H
    H --> I[Recipe Builder Lab]
    H --> J[Multi-Scenario Comparison]
    H --> K[Invent readiness diagnostics (export disabled)]
    K --> L[dbc_config.jsonc Output]
    H --> M[Local Storage Preset Library]
    N[Solana Public RPC] --> O[Read-Only On-Chain Verification]
    O --> P[Official DBC SDK StateService]
```

---

## 2. Layer Separation & Design Boundaries

### A. Domain Layer (`src/domain/`)
- **`types.ts`**: Pure type models defining `LaunchRequirements`, `CurveSegment`, `DerivedRecipeMetrics`, `TradeOffSummary`, `ValidationResult`, and `MeteoraInventConfig`.
- **`constants.ts`**: Meteora/Solana program identifiers, quote-token examples, and fee numeric constants. No migration-keeper identity or keeper-eligibility claim is made.

### B. Pure Mathematical Engine (`src/engine/`)
Contains zero side effects and zero network dependencies; fully testable via unit tests:
- **`curveMath.ts`**: Exact concentrated-liquidity virtual reserve calculations:
  - $\Delta \text{Base} = L \cdot \left(\frac{1}{\sqrt{P_a}} - \frac{1}{\sqrt{P_b}}\right)$
  - $\Delta \text{Quote} = L \cdot (\sqrt{P_b} - \sqrt{P_a})$
  - Curve generation for modes 0 through 5 (single segment, two segment, 16 weighted segments, mid-price anchor).
  - Multi-checkpoint slippage progression modeling (25%, 50%, 75%, 100%).
- **`feeMath.ts`**: Base fee numerators, fee scheduler decay algorithms (linear and exponential decay), the documented DBC trading-fee split, creator/partner allocation of the configured non-protocol share, and post-graduation surplus division. These values are separate from migrated LP ownership.
- **`validationEngine.ts`**: Selected local input checks for mode parameters and fee ranges; no keeper eligibility claim.
- **`tradeOffEngine.ts`**: Qualitative benefit/drawback explanations tied to selected recipe parameters; no composite ratings or outcome predictions.
- **`scenarioComparison.ts`**: Aggregates candidate recipes and separates selected exact input arithmetic from derived values and assumption-dependent analytical estimates. It does not claim SDK or on-chain simulation parity.

### C. Protocol & Tooling Adapters (`src/adapters/`)
- **`meteora/inventSerializer.ts`**: Contains local report/formatting helpers and readiness diagnostics. It does not provide a complete, validated Invent JSONC export; the user-facing Invent export remains disabled.
- **`solana/readOnlyClient.ts`**: Safe, read-only on-chain RPC inspector using `@solana/web3.js` and official `@meteora-ag/dynamic-bonding-curve-sdk` with bounded timeouts and HTTP 429 rate-limit catches.

### D. Data & Factory (`src/data/`)
- **`recipeFactory.ts`**: Deterministic constructor turning raw launch requirements into full, validated recipes.
- **`exampleRecipes.ts`**: 6 illustrative example recipes; these are not battle-tested, endorsed, or optimized configurations.

### E. Presentation Layer (`src/components/`, `src/pages/`)
- React 19 + Tailwind CSS v4 design system with dark navy glassmorphism.
- Interactive Recharts charts for bonding curves and comparative multi-scenario curves.
- LocalStorage client-side persistence for user-created launch recipes.

---

## 3. Data Flow & Execution Pipeline

1. **Intake**: Builder enters target asset profile via `RequirementsWizardPage`.
2. **Synthesis**: `recipeFactory` invokes `curveMath`, `feeMath`, and `tradeOffEngine` to generate segments and metrics.
3. **Validation**: `validationEngine` applies selected local rules and SDK helper checks using DBC SDK v1.5.13; this is not full protocol or Invent configuration validation.
4. **Interactive Exploration**: Builder inspects curve shapes, trades off parameters, and tunes values live in `RecipeBuilderPage`.
5. **Comparison**: Builder compares alternative structures in `ComparisonPage`.
6. **Export**: Builder reports Invent readiness (no config export) or saves the recipe locally in `RecipeLibraryPage`.
7. **Verification**: Builder verifies live pool accounts on Solana mainnet/devnet via `VerificationPage`.

