import BigNumber from "bignumber.js";

export function yoctoToNear(amount: string): string {
    let x = new BigNumber(amount);
    x = x.div(new BigNumber(10).pow(24 - 6));
    const res = (x.toNumber() / 1000000).toFixed(2);
    return res;
}
