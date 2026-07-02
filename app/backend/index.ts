import express from "express";
import { PORT_NO } from "./config";
import cors from "cors";
import { getPrices } from "./conindcx.prices";
import { binanceGetPrices } from "./binance.prices";
import { bybitGetPrices } from "./bybit.prices";
import { fetchBybitOrderbook } from "./bybit.prices";

const app = express();
app.use(cors());
app.use(express.json());
export const assetId = "B-SOL_USDT";
export const bAssetId = "SOLUSDT"

app.listen(PORT_NO, async () => {
  console.log(`Server is running on port ${PORT_NO}`);
setInterval(async () => {
  try {
    const data = await getPrices(assetId);   
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
},900);

setInterval(async () => {
  try{
    
    const data = await binanceGetPrices(bAssetId);    
  }catch(e){
    console.log(e);
  }
},1000);

setInterval(async () => {
    try {
      const data = await fetchBybitOrderbook(bAssetId);
      const rows = bybitGetPrices(data);
      console.log("Bybit orderbook:");
      console.table(rows);
    } catch (e) {
      console.error("Bybit error:", e);
    }
  }, 1100);

});