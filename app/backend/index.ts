import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { PORT_NO } from "./config";
import { coindcxGetPrices } from "./conindcx.prices";
import { binanceGetPrices } from "./binance.prices";
import { fetchBybitOrderbook } from "./bybit.prices";

// NOTE: Interface structure updated slightly to handle standalone depth layers cleanly
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

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Explicit frontend rule
app.use(express.json());

export const assetId = "B-ETH_USDT";
export const bAssetId = "ETHUSDT";

interface ExchangeData {
  bids: Map<string, number>;
  asks: Map<string, number>;
}

const binanceBook: ExchangeData = { bids: new Map(), asks: new Map() };
const bybitBook: ExchangeData = { bids: new Map(), asks: new Map() };
const coinDcxBook: ExchangeData = { bids: new Map(), asks: new Map() };

// The state payload now natively splits Bids and Asks
let aggregatedOrderBook: StructuredOrderBook = { bids: [], asks: [] };

// SSE clients
const clients = new Set<Response>();

function broadcastOrderBook() {
  const payload = `data: ${JSON.stringify(aggregatedOrderBook)}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

function aggregateOrderBooks(): void {
  const aggregatedBids: Record<string, { binance: number; bybit: number; coinDcx: number }> = {};
  const aggregatedAsks: Record<string, { binance: number; bybit: number; coinDcx: number }> = {};
  
  const uniqueBidPrices = new Set<string>();
  const uniqueAskPrices = new Set<string>();

  // --- PROCESS BIDS ---
  binanceBook.bids.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueBidPrices.add(price);
    if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedBids[price].binance += val;
  });
  bybitBook.bids.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueBidPrices.add(price);
    if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedBids[price].bybit += val;
  });
  coinDcxBook.bids.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueBidPrices.add(price);
    if (!aggregatedBids[price]) aggregatedBids[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedBids[price].coinDcx += val;
  });

  // --- PROCESS ASKS ---
  binanceBook.asks.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueAskPrices.add(price);
    if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedAsks[price].binance += val;
  });
  bybitBook.asks.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueAskPrices.add(price);
    if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedAsks[price].bybit += val;
  });
  coinDcxBook.asks.forEach((val, p) => {
    const price = parseFloat(p).toFixed(2);
    uniqueAskPrices.add(price);
    if (!aggregatedAsks[price]) aggregatedAsks[price] = { binance: 0, bybit: 0, coinDcx: 0 };
    aggregatedAsks[price].coinDcx += val;
  });

  // CRITICAL FIX: Sort Bids Descending (Highest buy order first)
  const sortedBidPrices = Array.from(uniqueBidPrices).sort((a, b) => parseFloat(b) - parseFloat(a));
  
  // CRITICAL FIX: Sort Asks Ascending (Lowest sell order first)
  const sortedAskPrices = Array.from(uniqueAskPrices).sort((a, b) => parseFloat(a) - parseFloat(b));

  // Map out distinct depth matrices
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

  // Assign clean layout split state
  aggregatedOrderBook = {
    bids: bidRows,
    asks: askRows,
  };

  broadcastOrderBook();
}

app.get("/api/orderbook", (_req: Request, res: Response) => {
  res.json(aggregatedOrderBook);
});

app.get("/api/orderbook/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.add(res);
  res.write(`data: ${JSON.stringify(aggregatedOrderBook)}\n\n`);

  req.on("close", () => {
    clients.delete(res);
  });
});

async function updateCoinDcx() {
  try {
    const data = await coindcxGetPrices(assetId) as any;
    if (data) {
      coinDcxBook.bids.clear();
      coinDcxBook.asks.clear();
      if (data.bids && typeof data.bids === 'object' && !Array.isArray(data.bids)) {
        Object.entries(data.bids).forEach(([price, qty]) => {
          coinDcxBook.bids.set(price, parseFloat(String(qty)));
        });
      }
      if (data.asks && typeof data.asks === 'object' && !Array.isArray(data.asks)) {
        Object.entries(data.asks).forEach(([price, qty]) => {
          coinDcxBook.asks.set(price, parseFloat(String(qty)));
        });
      }
      aggregateOrderBooks();
    }
  } catch (error) {
    console.error("CoinDCX error:", error);
  }
}

async function updateBinance() {
  try {
    const data = await binanceGetPrices(bAssetId) as any;
    if (data?.bids || data?.asks) {
      binanceBook.bids.clear();
      binanceBook.asks.clear();
      data.bids?.forEach((entry: any) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          binanceBook.bids.set(String(entry[0]), parseFloat(entry[1]));
        }
      });
      data.asks?.forEach((entry: any) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          binanceBook.asks.set(String(entry[0]), parseFloat(entry[1]));
        }
      });
      aggregateOrderBooks();
    }
  } catch (e) {
    console.error("Binance error:", e);
  }
}

async function updateBybit() {
  try {
    const rawData = await fetchBybitOrderbook(bAssetId) as any;
    if (rawData?.result) {
      bybitBook.bids.clear();
      bybitBook.asks.clear();
      rawData.result.b?.forEach((entry: any) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          bybitBook.bids.set(String(entry[0]), parseFloat(entry[1]));
        }
      });
      rawData.result.a?.forEach((entry: any) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          bybitBook.asks.set(String(entry[0]), parseFloat(entry[1]));
        }
      });
      aggregateOrderBooks();
    }
  } catch (e) {
    console.error("Bybit error:", e);
  }
}

app.listen(PORT_NO, () => {
  console.log(`Server is running on port ${PORT_NO}`);
  updateCoinDcx();
  updateBinance();
  updateBybit();

  setInterval(updateCoinDcx, 6000);
  setInterval(updateBinance, 4000);
  setInterval(updateBybit, 2000);
});
