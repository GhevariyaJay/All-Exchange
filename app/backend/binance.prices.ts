import { binance_marketURL } from './config';
import axios from 'axios';

export async function binanceGetPrices(marketId: string) {
  
    const res = await axios.get(binance_marketURL(marketId));
    const data = res.data;

    // const bids = data.bids.map(([price, qty]: [string, string]) => ({
    //   price: Number(price),
    //   qty: Number(qty),
    // }));

    // const asks = data.asks.map(([price, qty]: [string, string]) => ({
    //   price: Number(price),
    //   qty: Number(qty),
    // }));

    // const rows = bids.map((bid , i ) => {
    //   const ask = asks[i];
      
    //   return {
    //     'Binance Bid Amount': bid.price,
    //     'Bid Qty': bid.qty,
    //     'Biance Ask Amount': ask?.price ?? null,
    //     'Ask Qty': ask?.qty ?? null,
    //     'Profit': ask ? Number((ask.price - bid.price).toFixed(2)) : null,
    //   };
    // });
    // console.log("Binance orderbook:");
    // console.table(rows);
    // console.log("Binance orderbook data:", data);
   return data;
  
  }
  
