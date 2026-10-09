import { Connection, PublicKey, type AccountInfo } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { METEORA_DBC_PROGRAM_ID } from '../../domain/constants';

export interface PoolVerificationResult {
  poolAddress: string;
  isValidSolanaAddress: boolean;
  rpcEndpointUsed: string;
  observationTimestamp: string;
  evidenceSource: 'live-rpc' | 'local-only' | 'injected-test';
  status: 'VERIFIED_DBC_POOL' | 'DBC_PROGRAM_ACCOUNT_UNDECODABLE' | 'VALID_SOLANA_ACCOUNT_NOT_DBC' | 'ACCOUNT_NOT_FOUND' | 'RPC_ERROR_OR_RATE_LIMIT' | 'OFFLINE';
  isDbcProgramOwned: boolean;
  accountOwner?: string;
  lamportsBalance?: number;
  dataSize?: number;
  decodedPoolState?: {
    configKey?: string;
    baseMint?: string;
    quoteMint?: string;
    quoteReserve?: string;
    baseReserve?: string;
    isMigrated?: boolean;
    curveProgressPercent?: number;
  };
  diagnosticMessage: string;
  unsupportedOrMissingFields?: string[];
}

export interface PoolVerificationDependencies {
  getAccountInfo?: (connection: Connection, address: PublicKey) => Promise<AccountInfo<Buffer> | null>;
  decodePool?: (connection: Connection, address: PublicKey) => Promise<unknown | null>;
  fetchImpl?: typeof fetch;
}

export function isValidPublicKey(address: string): boolean {
  try {
    return new PublicKey(address).toBytes().length === 32;
  } catch {
    return false;
  }
}

/** Retries transient HTTP failures once; aborts are never retried. */
export async function fetchWithBoundedRetry(input: RequestInfo | URL, init: RequestInit, fetchImpl: typeof fetch = fetch): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchImpl(input, init);
      if (attempt === 0 && [429, 502, 503, 504].includes(response.status)) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt > 0 || (error instanceof Error && error.name === 'AbortError')) throw error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw new Error('RPC retry limit exceeded.');
}

function normalizeDecodedPool(pool: unknown): PoolVerificationResult['decodedPoolState'] | undefined {
  if (!pool || typeof pool !== 'object') return undefined;
  const state = (pool as { poolState?: Record<string, unknown> }).poolState ?? pool as Record<string, unknown>;
  const asAddress = (value: unknown) => value && typeof (value as { toBase58?: unknown }).toBase58 === 'function' ? (value as PublicKey).toBase58() : undefined;
  const baseMint = asAddress(state.baseMint);
  const quoteMint = asAddress(state.quoteMint);
  if (!baseMint || !quoteMint || !isValidPublicKey(baseMint) || !isValidPublicKey(quoteMint)) return undefined;
  const asString = (value: unknown) => value && typeof (value as { toString?: unknown }).toString === 'function' ? String(value) : undefined;
  return {
    configKey: asAddress(state.config),
    baseMint,
    quoteMint,
    quoteReserve: asString(state.quoteReserve),
    baseReserve: asString(state.baseReserve),
    isMigrated: typeof state.isMigrated === 'boolean' ? state.isMigrated : undefined,
  };
}

/** Read-only inspection only: no wallet, keypair, signing, or transaction path. */
export async function verifyOnChainPool(
  poolAddressInput: string,
  rpcUrl: string = 'https://api.mainnet-beta.solana.com',
  dependencies: PoolVerificationDependencies = {},
): Promise<PoolVerificationResult> {
  const timestamp = new Date().toISOString();
  const cleanAddress = poolAddressInput?.trim() ?? '';
  const localResult = (message: string): PoolVerificationResult => ({
    poolAddress: cleanAddress,
    isValidSolanaAddress: false,
    rpcEndpointUsed: rpcUrl,
    observationTimestamp: timestamp,
    evidenceSource: 'local-only',
    status: 'OFFLINE',
    isDbcProgramOwned: false,
    diagnosticMessage: message,
  });
  if (!cleanAddress) return localResult('No pool address supplied. Enter a valid Solana public key.');
  if (!isValidPublicKey(cleanAddress)) return localResult(`"${cleanAddress}" is not a valid Solana public key format.`);

  const address = new PublicKey(cleanAddress);
  const evidenceSource = Object.keys(dependencies).length ? 'injected-test' as const : 'live-rpc' as const;
  const timeoutMs = 8_000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      fetch: (input, init) => fetchWithBoundedRetry(input, { ...init, signal: controller.signal }, dependencies.fetchImpl),
    });
    const accountInfo = dependencies.getAccountInfo
      ? await dependencies.getAccountInfo(connection, address)
      : await connection.getAccountInfo(address);
    if (!accountInfo) return {
      poolAddress: cleanAddress, isValidSolanaAddress: true, rpcEndpointUsed: rpcUrl,
      observationTimestamp: timestamp, evidenceSource, status: 'ACCOUNT_NOT_FOUND',
      isDbcProgramOwned: false, diagnosticMessage: 'Account not found on the selected RPC cluster.',
    };

    const accountOwner = accountInfo.owner.toBase58();
    const common = {
      poolAddress: cleanAddress,
      isValidSolanaAddress: true,
      rpcEndpointUsed: rpcUrl,
      observationTimestamp: timestamp,
      evidenceSource,
      accountOwner,
      lamportsBalance: accountInfo.lamports,
      dataSize: accountInfo.data.length,
    };
    if (accountOwner !== METEORA_DBC_PROGRAM_ID) return {
      ...common, status: 'VALID_SOLANA_ACCOUNT_NOT_DBC', isDbcProgramOwned: false,
      diagnosticMessage: `Account exists but is owned by ${accountOwner}, not the configured DBC program.`,
    };

    let decoded: PoolVerificationResult['decodedPoolState'];
    let decodeError: unknown;
    try {
      const pool = dependencies.decodePool
        ? await dependencies.decodePool(connection, address)
        : await new DynamicBondingCurveClient(connection, 'confirmed').state.getPool(address);
      decoded = normalizeDecodedPool(pool);
    } catch (error) {
      decodeError = error;
    }
    if (!decoded) return {
      ...common, status: 'DBC_PROGRAM_ACCOUNT_UNDECODABLE', isDbcProgramOwned: true,
      diagnosticMessage: 'Account is DBC-program-owned but did not decode as a complete pool; it is not confirmed as a DBC pool.',
      unsupportedOrMissingFields: [decodeError instanceof Error ? decodeError.message : 'SDK returned missing or malformed pool fields.'],
    };
    return {
      ...common, status: 'VERIFIED_DBC_POOL', isDbcProgramOwned: true, decodedPoolState: decoded,
      diagnosticMessage: 'Live RPC account ownership and required SDK pool fields were verified.',
    };
  } catch (error) {
    const isTimeout = error instanceof Error && (error.name === 'AbortError' || error.message.toLowerCase().includes('timeout'));
    const message = error instanceof Error ? error.message : 'Unknown network failure.';
    return {
      poolAddress: cleanAddress, isValidSolanaAddress: true, rpcEndpointUsed: rpcUrl,
      observationTimestamp: timestamp, evidenceSource, status: 'RPC_ERROR_OR_RATE_LIMIT',
      isDbcProgramOwned: false,
      diagnosticMessage: isTimeout ? `RPC request timed out after ${timeoutMs} ms.` : /429|too many requests/i.test(message) ? 'RPC rate limited this read (HTTP 429); the request was bounded and safely stopped.' : `RPC unavailable: ${message}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
