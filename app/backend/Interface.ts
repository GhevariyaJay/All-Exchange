// Interface.ts
export interface Orderbooklevel {
    price: number;
    totalBid: number;
    binancebid: number;
    binanceask: number;
    bybitbid: number;
    totalAsk: number;
    bybitask: number;
    coindcxbid: number;
    coindcxask: number;
}

export interface ExchangeData {
    bids: Map<string, number>;
    asks: Map<string, number>;
}
