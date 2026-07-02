
export function coindcx_marketURL(assetId: string){
    const URL=`https://public.coindcx.com/market_data/orderbook?pair=${assetId}`;
    return URL;
}

export function binance_marketURL(assetId: string){
    const URL=`https://api.binance.com/api/v3/depth?symbol=${assetId}&limit=4119`;
    return URL;
}

export function bybit_marketURL(assetId: string) {
  const URL =`https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${assetId}&limit=1000`;
  return URL;
}
 
export const PORT_NO=3000;