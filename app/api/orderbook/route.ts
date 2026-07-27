import { NextResponse } from "next/server";
// Adjust these relative paths if your price files are in a different folder
import { binanceGetPrices } from "../../backend/binance.prices";
import { coindcxGetPrices } from "../../backend/conindcx.prices";
import { fetchBybitOrderbook } from "../../backend/bybit.prices";

interface DepthLevel {
  price: string;
  total: number;
  binance: number;
  bybit: number;
  coinDcx: number;
}

interface StructuredOrderBook {
  bids: DepthLevel[];
  asks: DepthLevel[];
}

function convertPairSymbols(rawPair: string) {
  const structuralBase = rawPair.replace("/", "-").toUpperCase();
  const dynamicTicker = structuralBase.replace("-", "");
  return {
    coinDcxId: `B-${structuralBase.replace("-", "_")}`,
    standardId: dynamicTicker
  };
}

function generateAggregatedDepth(binanceData: any, bybitData: any, coinDcxData: any): StructuredOrderBook {
  const localBinanceBids = new Map<string, number>();
  const localBinanceAsks = new Map<string, number>();
  const localBybitBids = new Map<string, number>();
  const localBybitAsks = new Map<string, number>();
  const localCoinDcxBids = new Map<string, number>();
  const localCoinDcxAsks = new Map<string, number>();

  if (binanceData?.bids || binanceData?.asks) {
    binanceData.bids?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBinanceBids.set(String(entry[0]), parseFloat(entry[1])); 
    });
    binanceData.asks?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBinanceAsks.set(String(entry[0]), parseFloat(entry[1])); 
    });
  }

  if (bybitData?.result) {
    bybitData.result.b?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBybitBids.set(String(entry[0]), parseFloat(entry[1])); 
    });
    bybitData.result.a?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBybitAsks.set(String(entry[0]), parseFloat(entry[1])); 
    });
  }

  if (coinDcxData) {
    if (coinDcxData.bids && typeof coinDcxData.bids === 'object' && !Array.isArray(coinDcxData.bids)) {
      Object.entries(coinDcxData.bids).forEach(([price, qty]) => { localCoinDcxBids.set(price, parseFloat(String(qty))); });
    }
    if (coinDcxData.asks && typeof coinDcxData.asks === 'object' && !Array.isArray(coinDcxData.asks)) {
      Object.entries(coinDcxData.asks).forEach(([price, qty]) => { localCoinDcxAsks.set(price, parseFloat(String(qty))); });
    }
  }

  const aggregatedBids: Record<string, { binance: number; bybit: number; coinDcx: number }> = {};
  const aggregatedAsks: Record<string, { binance: number; bybit: number; coinDcx: number }> = {};
  const uniqueBidPrices = new Set<string>();
  const uniqueAskPrices = new Set<string>();

  localBinanceBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].binance += val; });
  localBybitBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].bybit += val; });
  localCoinDcxBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].coinDcx += val; });

  localBinanceAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].binance += val; });
  localBybitAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].bybit += val; });
  localCoinDcxAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].coinDcx += val; });

  const sortedBidPrices = Array.from(uniqueBidPrices).sort((a, b) => parseFloat(b) - parseFloat(a));
  const sortedAskPrices = Array.from(uniqueAskPrices).sort((a, b) => parseFloat(a) - parseFloat(b));

  const bidRows: DepthLevel[] = sortedBidPrices.slice(0, 25).map((priceStr) => {
    const data: any = aggregatedBids[priceStr];
    return { price: priceStr, total: +(data.binance + data.bybit + data.coinDcx).toFixed(4), binance: +data.binance.toFixed(4), bybit: +data.bybit.toFixed(4), coinDcx: +data.coinDcx.toFixed(4) };
  });

  const askRows: DepthLevel[] = sortedAskPrices.slice(0, 25).map((priceStr) => {
    const data: any = aggregatedAsks[priceStr];
    return { price: priceStr, total: +(data.binance + data.bybit + data.coinDcx).toFixed(4), binance: +data.binance.toFixed(4), bybit: +data.bybit.toFixed(4), coinDcx: +data.coinDcx.toFixed(4) };
  });

  return { bids: bidRows, asks: askRows };
}

// This GET function replaces your Express app.get("/api/orderbook")
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPairQuery = searchParams.get("pair") || "SOL-USDT";
    const symbols = convertPairSymbols(rawPairQuery);

    const [binanceData, bybitData, coinDcxData] = await Promise.all([
      binanceGetPrices(symbols.standardId).catch(() => null),
      fetchBybitOrderbook(symbols.standardId).catch(() => null),
      coindcxGetPrices(symbols.coinDcxId).catch(() => null),
    ]);

    const resultPayload = generateAggregatedDepth(binanceData, bybitData, coinDcxData);
    return NextResponse.json(resultPayload);
  } catch (error) {
    console.error("Orderbook extraction routing error:", error);
    return NextResponse.json({ error: "Failed to generate dynamic data matrices." }, { status: 500 });
  }
}
