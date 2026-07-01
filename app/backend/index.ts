import express from "express";
import { PORT_NO } from "./config";
import cors from "cors";
import { getPrices } from "./conindcx.prices";

const app = express();
app.use(cors());
app.use(express.json());
export const assetId = "B-SOL_USDT";

app.listen(PORT_NO, async () => {
  console.log(`Server is running on port ${PORT_NO}`);
setInterval(async () => {
  try {
    const data = await getPrices(assetId);   
    console.log(data);
  } catch (error) {
    console.error(error);
  }
},1000);

});