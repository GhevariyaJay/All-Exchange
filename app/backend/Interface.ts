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

export interface OrderBookRow {
  price: string;
  totalBid: number;
  binanceBid: number;
  bybitBid: number;
  coinDcxBid: number;
  totalAsk: number;
  binanceAsk: number;
  bybitAsk: number;
  coinDcxAsk: number;
}

export interface DepthLevel {
  price: string;
  total: number;
  binance: number;
  bybit: number;
  coinDcx: number;
}

export interface StructuredOrderBook {
  bids: DepthLevel[];
  asks: DepthLevel[];
}

export const localBinanceBids = new Map<string, number>();
export const localBinanceAsks = new Map<string, number>();
export const localBybitBids = new Map<string, number>();
export const localBybitAsks = new Map<string, number>();
export const localCoinDcxBids = new Map<string, number>();
export const localCoinDcxAsks = new Map<string, number>();