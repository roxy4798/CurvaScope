import type { QuoteMintPreset } from './types';

export const METEORA_DBC_PROGRAM_ID = 'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN';
export const METEORA_DAMM_V2_PROGRAM_ID = 'cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG';
export const METEORA_DAMM_V1_PROGRAM_ID = 'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB';
export const METEORA_LOCKER_PROGRAM_ID = 'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn';
export const METEORA_DYNAMIC_VAULT_PROGRAM_ID = '24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi';
export const METEORA_DBC_POOL_AUTHORITY = 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM';

export const QUOTE_MINT_PRESETS: QuoteMintPreset[] = [
  {
    symbol: 'SOL',
    name: 'Wrapped SOL',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    mintAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
  },
  {
    symbol: 'USD1',
    name: 'World Liberty Financial USD',
    mintAddress: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
    decimals: 6,
  },
  {
    symbol: 'MET',
    name: 'Meteora',
    mintAddress: 'METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL',
    decimals: 9,
  },
  {
    symbol: 'JupUSD',
    name: 'Jupiter USD',
    mintAddress: 'JuprjznTrTSp2UFa3ZBUFgwdAmtZCq4MQCwysN55USD',
    decimals: 6,
  },
  {
    symbol: 'TRUMP',
    name: 'OFFICIAL TRUMP',
    mintAddress: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
    decimals: 6,
  },
];

export const PROTOCOL_LIMITS = {
  FEE_DENOMINATOR: 1_000_000_000,
  MIN_FEE_BPS: 25, // 0.25%
  MAX_FEE_BPS: 9900, // 99.00%
  MIN_FEE_NUMERATOR: 2_500_000,
  MAX_FEE_NUMERATOR: 990_000_000,
  MAX_CURVE_POINTS: 16,
  PROTOCOL_FEE_PERCENT: 20, // Source-defined protocol share of trading fees
  REFERRAL_FEE_PERCENT_OF_PROTOCOL: 20, // Source-defined referral share of protocol fee when present
  PROTOCOL_MIGRATION_FEE_PERCENT: 0.2, // 0.2% fixed protocol LP migration deduction
  MAX_MIGRATION_FEE_PERCENTAGE: 99,
  MAX_INVENT_MIGRATION_FEE_PERCENTAGE: 50,
  MAX_LOCK_DURATION_SECONDS: 63_072_000, // 2 years
  SECONDS_PER_DAY: 86400,
  MIN_LOCKED_LIQUIDITY_BPS: 1000, // 10%
  DAMM_V2_FEE_TIERS_BPS: [25, 30, 100, 200, 400, 600, 1000] as const,
};

export const DAMM_V2_FEE_CONFIG_KEYS = {
  25: '7F6dnUcRuyM2TwR8myT1dYypFXpPSxqwKNSFNkxyNESd',
  30: '2nHK1kju6XjphBLbNxpM5XRGFj7p9U8vvNzyZiha1z6k',
  100: 'Hv8Lmzmnju6m7kcokVKvwqz7QPmdX9XfKjJsXz8RXcjp',
  200: '2c4cYd4reUYVRAB9kUUkrq55VPyy2FNQ3FDL4o12JXmq',
  400: 'AkmQWebAwFvWk55wBoCr5D62C6VVDTzi84NJuD9H7cFD',
  600: 'DbCRBj8McvPYHJG1ukj8RE15h2dCNUdTAESG49XpQ44u',
  custom: 'A8gMrEPJkacWkcb3DGwtJwTe16HktSEfvwtuDh2MCtck',
};

