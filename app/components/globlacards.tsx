import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Radar, Layers3 } from "lucide-react";
import { useOrderbook } from "../hooks/useOrderbook";

export function GlobalCards({ activePair }: { activePair: string }) {

  const { rows, loading } = useOrderbook(activePair);

  // 1. Initialize fallback state variables
  let bestBidPrice = "0.00";
  let bestAskPrice = "0.00";
  let spread = "0.00";
  let bookImbalance = "0.0%";
  let bidVenues = "No data";
  let askVenues = "No data";

  if (!loading && rows.length > 0) {
    // 2. Find Best Bid (First row from top where totalBid > 0)
    const bidRow = rows.find((r) => r.totalBid > 0);
    if (bidRow) {
      bestBidPrice = parseFloat(bidRow.price).toFixed(7);
      
      const localBidVenues: string[] = [];
      if (bidRow.binanceBid > 0) localBidVenues.push("Binance");
      if (bidRow.bybitBid > 0) localBidVenues.push("Bybit");
      if (bidRow.coinDcxBid > 0) localBidVenues.push("CoinDCX");
      bidVenues = localBidVenues.length > 0 ? localBidVenues.join(" · ") : "None";
    }

    // 3. Find Best Ask (Last row from top/lowest price where totalAsk > 0)
    const askRow = [...rows].reverse().find((r) => r.totalAsk > 0);
    if (askRow) {
      bestAskPrice = parseFloat(askRow.price).toFixed(7);

      const localAskVenues: string[] = [];
      if (askRow.binanceAsk > 0) localAskVenues.push("Binance");
      if (askRow.bybitAsk > 0) localAskVenues.push("Bybit");
      if (askRow.coinDcxAsk > 0) localAskVenues.push("CoinDCX");
      askVenues = localAskVenues.length > 0 ? localAskVenues.join(" · ") : "None";
    }

    // 4. Calculate Market Spread
    if (bidRow && askRow) {
      const bidNum = parseFloat(bidRow.price);
      const askNum = parseFloat(askRow.price);
      const spreadDiff = Math.abs(askNum - bidNum);
      spread = spreadDiff.toFixed(7);
    }

    // 5. Calculate Order Book Volume Imbalance
    let totalBidVolume = 0;
    let totalAskVolume = 0;
    rows.forEach((r) => {
      totalBidVolume += r.totalBid;
      totalAskVolume += r.totalAsk;
    });

    const totalVolume = totalBidVolume + totalAskVolume;
    if (totalVolume > 0) {
      const imbalanceRatio = ((totalBidVolume - totalAskVolume) / totalVolume) * 100;
      const prefix = imbalanceRatio >= 0 ? "+" : "";
      bookImbalance = `${prefix}${imbalanceRatio.toFixed(2)}%`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Global Best Bid Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Global Best Bid</p>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-emerald-400">
            {loading ? "..." : bestBidPrice}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {loading ? "Loading venues..." : bidVenues}
          </p>
        </CardContent>
      </Card>

      {/* Global Best Ask Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Global Best Ask</p>
            <TrendingDown className="size-4 text-rose-400" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-rose-400">
            {loading ? "..." : bestAskPrice}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {loading ? "Loading venues..." : askVenues}
          </p>
        </CardContent>
      </Card>

      {/* Market Spread Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Market Spread</p>
            <Radar className="size-4 text-cyan-400" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-cyan-400">
            {loading ? "..." : spread}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {parseFloat(spread) <= 0.05 ? "Ultra-tight depth" : "Normal variance"}
          </p>
        </CardContent>
      </Card>

      {/* Book Imbalance Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Book Imbalance</p>
            <Layers3 className="size-4 text-violet-400" />
          </div>
          <p className={`mt-3 text-3xl font-semibold ${bookImbalance.startsWith("-") ? "text-rose-400" : "text-violet-400"}`}>
            {loading ? "..." : bookImbalance}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {bookImbalance.startsWith("-") ? "Ask depth stronger" : "Bid depth stronger"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
