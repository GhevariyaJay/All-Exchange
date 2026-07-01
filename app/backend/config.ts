
export function coindcx_marketURL(assetId: string){
    const URL=`https://public.coindcx.com/market_data/orderbook?pair=${assetId}`;
    return URL;
}
 
export const PORT_NO=3000;