import { useState, useEffect } from "react";

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

export function useOrderbook() {
  const [rows, setRows] = useState<OrderBookRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const EXPRESS_BACKEND_PORT = "3000";
    let isMounted = true;

    const fetchOrderbook = async () => {
      try {
        const response = await fetch(
          `http://localhost:${EXPRESS_BACKEND_PORT}/api/orderbook`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data: OrderBookRow[] = await response.json();

        if (isMounted) {
          setRows(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch orderbook data:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderbook();

    const interval = setInterval(() => {
      fetchOrderbook();
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { rows, loading };
}