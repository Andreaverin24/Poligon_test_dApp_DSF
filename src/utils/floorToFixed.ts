// utils/floorToFixed.ts

export const floorToFixed = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
};
