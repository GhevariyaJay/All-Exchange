import { useState, useEffect } from "react";
import { OrderBookRow } from "../backend/Interface";


export function useOrderbook(activePair: string) {
  const [rows, setRows] = useState<OrderBookRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const EXPRESS_BACKEND_PORT = "3000";
    let isMounted = true;

    // Standardize text format for your express API requirements (e.g., SOL/USDT -> sol-usdt)
    const formattedPairForAPI = activePair.replace("/", "-").toLowerCase();

    const fetchOrderbook = async () => {
      try {
        // Send selected currency symbol directly down to your express server route controller
        const response = await fetch(
          `http://localhost:${EXPRESS_BACKEND_PORT}/api/orderbook?pair=${formattedPairForAPI}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          if (result && (result.bids || result.asks)) {
            const rawBids = Array.isArray(result.bids) ? result.bids : [];
            const rawAsks = Array.isArray(result.asks) ? result.asks : [];

            const allPrices = Array.from(
              new Set([
                ...rawBids.map((b: any) => b.price),
                ...rawAsks.map((a: any) => a.price),
              ])
            ).sort((a, b) => parseFloat(b) - parseFloat(a));

            const mergedRows: OrderBookRow[] = allPrices.map((price) => {
              const bidMatch = rawBids.find((b: any) => b.price === price);
              const askMatch = rawAsks.find((a: any) => a.price === price);

              return {
                price,
                totalBid: bidMatch?.total || 0,
                binanceBid: bidMatch?.binance || 0,
                bybitBid: bidMatch?.bybit || 0,
                coinDcxBid: bidMatch?.coinDcx || 0,
                totalAsk: askMatch?.total || 0,
                binanceAsk: askMatch?.binance || 0,
                bybitAsk: askMatch?.bybit || 0,
                coinDcxAsk: askMatch?.coinDcx || 0,
              };
            });

            setRows(mergedRows);
          } else if (Array.isArray(result)) {
            setRows(result);
          } else {
            setRows([]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch orderbook data:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Trigger immediate loading visual reset when switching tokens
    setLoading(true);
    fetchOrderbook();

    const interval = setInterval(() => {
      fetchOrderbook();
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activePair]); // <-- CRITICAL: Forces execution cycle rerun when string updates

  return { rows, loading };
}
