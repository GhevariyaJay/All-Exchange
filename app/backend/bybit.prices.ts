import { bybit_marketURL } from "./config";
import axios from "axios";

type Level = [string, string];

export async function fetchBybitOrderbook(markeId: string) {
  
  const url = bybit_marketURL(markeId);
  const res = await axios.get(url);
  return res.data; 
}

export function bybitGetPrices(data: {
  result: {
    b: Level[];
    a: Level[];
  };
}) {
  const bids = data.result.b.map(([price, qty]) => ({
    price: Number(price),
    qty: Number(qty),
  }));

  const asks = data.result.a.map(([price, qty]) => ({
    price: Number(price),
    qty: Number(qty),
  }));

  const rows = bids.map((bid, i) => {
    const ask = asks[i];
    return {
      "Bybit Bid Amount": bid.price,
      "Bid Qty": bid.qty,
      "Bybit Ask Amount": ask?.price ?? null,
      "Ask Qty": ask?.qty ?? null,
      "Profit": ask ? Number((ask.price - bid.price).toFixed(7)) : null,
    };
  });

  return rows;
}