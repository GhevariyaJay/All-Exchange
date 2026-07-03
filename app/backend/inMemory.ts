// main.ts (or your current file name)
import type { ExchangeData, Orderbooklevel } from "./Interface";

export const binanceABook: ExchangeData = {
    bids: new Map(), asks: new Map()
};

export const bybitABook: ExchangeData = {
    bids: new Map(), asks: new Map()
};

export const coindcx: ExchangeData = {
    bids: new Map(), asks: new Map()
};

export let aggregatedOrderbook: Orderbooklevel[] = [];

export function aggregateOrderbooks(): void {
    const uniquePrices = new Set<string>([
        ...binanceABook.bids.keys(), ...binanceABook.asks.keys(),
        ...bybitABook.bids.keys(), ...bybitABook.asks.keys(),
        ...coindcx.bids.keys(), ...coindcx.asks.keys(),
    ]);

    const sortedPrices = Array.from(uniquePrices).sort((a, b) => parseFloat(b) - parseFloat(a));

    const rows: Orderbooklevel[] = sortedPrices.map((priceStr) => {
        // 1. Get raw numeric values from maps (defaulting to 0)
        const bBid = binanceABook.bids.get(priceStr) || 0;
        const bAsk = binanceABook.asks.get(priceStr) || 0;
        const byBid = bybitABook.bids.get(priceStr) || 0;
        const byAsk = bybitABook.asks.get(priceStr) || 0;
        const cBid = coindcx.bids.get(priceStr) || 0;
        const cAsk = coindcx.asks.get(priceStr) || 0;

        // 2. Return the completed object matching the Orderbooklevel interface exactly
        return {
            price: parseFloat(priceStr), // Converted to number
            binancebid: bBid,
            binanceask: bAsk,
            bybitbid: byBid,
            bybitask: byAsk,
            coindcxbid: cBid,
            coindcxask: cAsk,
            totalBid: bBid + byBid + cBid, // Added required field
            totalAsk: bAsk + byAsk + cAsk  // Added required field
        };
    });
    
    aggregatedOrderbook = rows.slice(0, 50);
}
