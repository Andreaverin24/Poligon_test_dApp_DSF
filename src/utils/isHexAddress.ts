// isHexAddress.ts

/**
 * Checks if a given value is a valid Ethereum address in the `0x...` format.
 *
 * An address is considered valid if:
 * - it is a string;
 * - it starts with `0x`;
 * - it contains exactly 40 hexadecimal characters after the `0x` prefix.
 *
 * @param val - The value to validate
 * @returns true if the value is a valid Ethereum address (`0x${string}`), otherwise false
 */
export const isHexAddress = (val: unknown): val is `0x${string}` => {
    return typeof val === 'string' && /^0x[a-fA-F0-9]{40}$/.test(val);
};
  