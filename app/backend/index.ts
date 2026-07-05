import express from "express";
// import type { Request, Response } from "express";
import cors from "cors";
import { PORT_NO } from "./config";
import { binanceFundingRates } from "./binance.prices";
import { coindcxGetPrices } from "./conindcx.prices";
import { binanceGetPrices } from "./binance.prices";
import { fetchBybitOrderbook } from "./bybit.prices";

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

const app = express();

app.use(cors()); 
app.use(express.json());

// Helper function to translate frontend format (e.g. "BTC/USDT") to exact Exchange conventions
function convertPairSymbols(rawPair: string) {
  const structuralBase = rawPair.replace("/", "-").toUpperCase(); // e.g. "BTC-USDT"
  const dynamicTicker = structuralBase.replace("-", "");          // e.g. "BTCUSDT"

  return {
    coinDcxId: `B-${structuralBase.replace("-", "_")}`,           // Matches "B-BTC_USDT" format
    standardId: dynamicTicker                                      // Matches "BTCUSDT" format
  };
}

// Fixed Aggregation Engine that cleanly maps matrix array layers via direct indexing
function generateAggregatedDepth(binanceData: any, bybitData: any, coinDcxData: any): StructuredOrderBook {
  const localBinanceBids = new Map<string, number>();
  const localBinanceAsks = new Map<string, number>();
  const localBybitBids = new Map<string, number>();
  const localBybitAsks = new Map<string, number>();
  const localCoinDcxBids = new Map<string, number>();
  const localCoinDcxAsks = new Map<string, number>();

  // ✅ FIXED: Parsing Binance [price, quantity] arrays
  if (binanceData?.bids || binanceData?.asks) {
    binanceData.bids?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBinanceBids.set(String(entry[0]), parseFloat(entry[1])); 
    });
    binanceData.asks?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBinanceAsks.set(String(entry[0]), parseFloat(entry[1])); 
    });
  }

  // ✅ FIXED: Parsing Bybit [price, quantity] arrays 
  if (bybitData?.result) {
    bybitData.result.b?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBybitBids.set(String(entry[0]), parseFloat(entry[1])); 
    });
    bybitData.result.a?.forEach((entry: any) => { 
      if (Array.isArray(entry) && entry.length >= 2) localBybitAsks.set(String(entry[0]), parseFloat(entry[1])); 
    });
  }

  // Parse CoinDCX structures
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

  // --- Aggregate Bids ---
  localBinanceBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].binance += val; });
  localBybitBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].bybit += val; });
  localCoinDcxBids.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueBidPrices.add(price); if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedBids[price].coinDcx += val; });

  // --- Aggregate Asks ---
  localBinanceAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].binance += val; });
  localBybitAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].bybit += val; });
  localCoinDcxAsks.forEach((val, p) => { const price = parseFloat(p).toFixed(2); uniqueAskPrices.add(price); if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 }; aggregatedAsks[price].coinDcx += val; });

  const sortedBidPrices = Array.from(uniqueBidPrices).sort((a, b) => parseFloat(b) - parseFloat(a));
  const sortedAskPrices = Array.from(uniqueAskPrices).sort((a, b) => parseFloat(a) - parseFloat(b));

  const bidRows: DepthLevel[] = sortedBidPrices.slice(0, 25).map((priceStr) => {
    const data: any = aggregatedBids[priceStr];
    return {
      price: priceStr,
      total: +(data.binance + data.bybit + data.coinDcx).toFixed(4),
      binance: +data.binance.toFixed(4),
      bybit: +data.bybit.toFixed(4),
      coinDcx: +data.coinDcx.toFixed(4),
    };
  });

  const askRows: DepthLevel[] = sortedAskPrices.slice(0, 25).map((priceStr) => {
    const data: any = aggregatedAsks[priceStr];
    return {
      price: priceStr,
      total: +(data.binance + data.bybit + data.coinDcx).toFixed(4),
      binance: +data.binance.toFixed(4),
      bybit: +data.bybit.toFixed(4),
      coinDcx: +data.coinDcx.toFixed(4),
    };
  });

  return { bids: bidRows, asks: askRows };
}

// Accept dynamic query string parameters

  
app.get("/api/orderbook", async (req: Request, res: Response) => {
  try {
    const rawPairQuery = (req.query.pair as string) || "SOL-USDT";
    const symbols = convertPairSymbols(rawPairQuery);

    // Simultaneously pull live network statistics 
    const [binanceData, bybitData, coinDcxData] = await Promise.all([
      binanceGetPrices(symbols.standardId).catch(() => null),
      fetchBybitOrderbook(symbols.standardId).catch(() => null),
      coindcxGetPrices(symbols.coinDcxId).catch(() => null),
    ]);

    const resultPayload = generateAggregatedDepth(binanceData, bybitData, coinDcxData);
    res.json(resultPayload);

  } catch (error) {
    console.error("Orderbook extraction routing error:", error);
    res.status(500).json({ error: "Failed to generate dynamic data matrices." });
  }
});



app.listen(PORT_NO, () => {
  console.log(`Dynamic multi-venue depth aggregation matrix server online on port ${PORT_NO}`);
  setInterval(() => {
    const res = binanceFundingRates("SOLUSDT");

  }, 1000);
});
