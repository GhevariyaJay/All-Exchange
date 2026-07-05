import { coindcx_marketURL } from './config'
import axios from 'axios'



export async function coindcxGetPrices(marketId: string) {
    const res = await axios.get(coindcx_marketURL(marketId));
    const data = res.data;
    

    // const bidsKeys = Object.keys(data?.bids || {}).sort((a, b) => parseFloat(b) - parseFloat(a));
    // const asksKeys = Object.keys(data?.asks || {}).sort((a, b) => parseFloat(a) - parseFloat(b));

    // const displayLength = Math.min(100, bidsKeys.length, asksKeys.length);
    // const orderBookTable = [];
    // let sum = 0;

    // for (let i = 0; i < displayLength; i++) {
    //     orderBookTable.push({
    //         "Coindcx Bid Amount": parseFloat(bidsKeys[i]!),
    //         "Bid Qty": parseFloat(data.bids[bidsKeys[i]!]),
    //         "Coindcx Ask Amount": parseFloat(asksKeys[i]!),
    //         "Ask Qty": parseFloat(data.asks[asksKeys[i]!]),
    //         "Profit" : parseFloat(asksKeys[i]!) - parseFloat(bidsKeys[i]!),
    //     });
    //     sum += orderBookTable[orderBookTable.length - 1]!.Profit;
    // }
    // // Prints a perfectly formatted, clean visual grid layout
    // console.table(orderBookTable);
    // console.log(`Total Profit: ${sum}`);
   return data;
}



