export class CryptoModel {
    name: string;
    symbol: string;
    priceUSD: number;
    marketCAP: number;
    volume: number;

    constructor(name: string, symbol:string, priceUSD: number, marketCAP: number, volume: number) {
        this.name = name;
        this.symbol = symbol;
        this.priceUSD = priceUSD;
        this.marketCAP = marketCAP;
        this.volume = volume;
    };
};
