import { describe, expect, it, vi } from 'vitest';
import { PublicKey, type AccountInfo } from '@solana/web3.js';
import { METEORA_DBC_PROGRAM_ID, METEORA_DBC_POOL_AUTHORITY } from '../src/domain/constants';
import { fetchWithBoundedRetry, isValidPublicKey, verifyOnChainPool } from '../src/adapters/solana/readOnlyClient';

const owner = new PublicKey(METEORA_DBC_PROGRAM_ID);
const account = (programOwner = owner): AccountInfo<Buffer> => ({
  owner: programOwner,
  lamports: 1234,
  data: Buffer.alloc(64),
  executable: false,
  rentEpoch: 0,
});
const deps = (getAccountInfo: () => Promise<AccountInfo<Buffer> | null>, decodePool: () => Promise<unknown | null> = async () => null) => ({
  getAccountInfo: async () => getAccountInfo(),
  decodePool: async () => decodePool(),
});

describe('read-only pool inspection evidence and failure states', () => {
  it('rejects malformed keys locally and does not label them as live RPC evidence', async () => {
    const result = await verifyOnChainPool('not-a-key', undefined, deps(vi.fn()));
    expect(result.status).toBe('OFFLINE');
    expect(result.evidenceSource).toBe('local-only');
    expect(result.isValidSolanaAddress).toBe(false);
  });

  it('accepts off-curve PDA addresses as Solana public keys', async () => {
    const pda = new PublicKey(METEORA_DBC_POOL_AUTHORITY);
    expect(PublicKey.isOnCurve(pda.toBytes())).toBe(false);
    expect(isValidPublicKey(pda.toBase58())).toBe(true);
    const result = await verifyOnChainPool(pda.toBase58(), 'https://rpc.invalid', deps(async () => null));
    expect(result.status).toBe('ACCOUNT_NOT_FOUND');
    expect(result.evidenceSource).toBe('injected-test');
  });

  it('reports missing accounts distinctly', async () => {
    const result = await verifyOnChainPool(METEORA_DBC_POOL_AUTHORITY, undefined, deps(async () => null));
    expect(result.status).toBe('ACCOUNT_NOT_FOUND');
    expect(result.isDbcProgramOwned).toBe(false);
  });

  it('rejects account data owned by a different program', async () => {
    const result = await verifyOnChainPool(METEORA_DBC_POOL_AUTHORITY, undefined, deps(async () => account(new PublicKey('11111111111111111111111111111111'))));
    expect(result.status).toBe('VALID_SOLANA_ACCOUNT_NOT_DBC');
    expect(result.accountOwner).toBe('11111111111111111111111111111111');
    expect(result.dataSize).toBe(64);
  });

  it('does not call a DBC-owned but undecodable or malformed account a verified pool', async () => {
    for (const malformed of [null, {}, { baseMint: 'bad', quoteMint: new PublicKey('11111111111111111111111111111111') }]) {
      const result = await verifyOnChainPool(METEORA_DBC_POOL_AUTHORITY, undefined, deps(async () => account(), async () => malformed));
      expect(result.status).toBe('DBC_PROGRAM_ACCOUNT_UNDECODABLE');
      expect(result.isDbcProgramOwned).toBe(true);
      expect(result.decodedPoolState).toBeUndefined();
    }
  });

  it('marks complete SDK-decoded fields as a live verified pool', async () => {
    const result = await verifyOnChainPool(METEORA_DBC_POOL_AUTHORITY, undefined, deps(async () => account(), async () => ({
      config: new PublicKey('11111111111111111111111111111111'),
      baseMint: new PublicKey('So11111111111111111111111111111111111111112'),
      quoteMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      quoteReserve: { toString: () => '1000' },
      baseReserve: { toString: () => '2000' },
      isMigrated: false,
    })));
    expect(result.status).toBe('VERIFIED_DBC_POOL');
    expect(result.evidenceSource).toBe('injected-test');
    expect(result.decodedPoolState?.baseMint).toBe('So11111111111111111111111111111111111111112');
  });

  it('reports HTTP 429 and timeout/unavailable endpoints without throwing', async () => {
    const address = METEORA_DBC_POOL_AUTHORITY;
    const limited = await verifyOnChainPool(address, undefined, deps(async () => { throw new Error('HTTP 429 Too Many Requests'); }));
    expect(limited.status).toBe('RPC_ERROR_OR_RATE_LIMIT');
    expect(limited.diagnosticMessage).toContain('HTTP 429');
    const timeoutError = Object.assign(new Error('The operation was aborted'), { name: 'AbortError' });
    const timedOut = await verifyOnChainPool(address, undefined, deps(async () => { throw timeoutError; }));
    expect(timedOut.status).toBe('RPC_ERROR_OR_RATE_LIMIT');
    expect(timedOut.diagnosticMessage).toContain('timed out');
    const unavailable = await verifyOnChainPool(address, undefined, deps(async () => { throw new Error('ECONNREFUSED'); }));
    expect(unavailable.status).toBe('RPC_ERROR_OR_RATE_LIMIT');
    expect(unavailable.diagnosticMessage).toContain('unavailable');
  });

  it('retries transient rate-limit responses once and then returns the final response', async () => {
    let calls = 0;
    const fetchStub = vi.fn(async () => {
      calls += 1;
      return new Response('', { status: calls === 1 ? 429 : 200 });
    }) as unknown as typeof fetch;
    const response = await fetchWithBoundedRetry('https://rpc.invalid', {}, fetchStub);
    expect(response.status).toBe(200);
    expect(calls).toBe(2);
  });
});
