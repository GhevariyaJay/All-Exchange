import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useOrderbook } from "../hooks/useOrderbook";
import { fundingRate } from "../backend/Interface";
import { useState, useEffect } from "react";

export function SpreadInfo({ activePair }: { activePair: string }) {
  // 1. Sanitize the string format (e.g., "uni-usdt" or "BTC/USDT" -> "UNIUSDT")
  const sanitizedPair = activePair.replace(/[-_/]/g, "").toUpperCase();

  // 2. Pass the clean ticker string directly to your hooks
  const { rows, loading } = useOrderbook(sanitizedPair);
  const [fundingRateValue, setFundingRateValue] = useState<number>(0);
  const [fundingLoading, setFundingLoading] = useState<boolean>(true);
  
  let binancetobybitspread = 0;
  let binancetoCoinDcxspread = 0;
  let bybittoCoinDcxspread = 0;

  let bidPercentage = 0;
  let askPercentage = 0;
  let imbalancePercentage = 0;
  let imbalanceSign = "+";

  // 3. Trigger funding data pull using the cleaned variable format
  useEffect(() => {
    let isMounted = true;
    setFundingLoading(true);

    async function fetchFunding() {
      try {
        const rate = await fundingRate(sanitizedPair);
        if (isMounted) {
          setFundingRateValue(rate);
        }
      } catch (err) {
        console.error("Failed to load background funding data:", err);
      } finally {
        if (isMounted) setFundingLoading(false);
      }
    }

    fetchFunding();
    return () => { isMounted = false; };
  }, [sanitizedPair]); // Listens for sanitized pair shifts

  if (!loading && rows && rows.length > 0) {
    // --- STEP A: Scan rows to find each exchange's specific best Bid/Ask ---
    const bBidRow = rows.find((r) => r.binanceBid > 0);
    const bAskRow = [...rows].reverse().find((r) => r.binanceAsk > 0);
    const binanceBidPrice = bBidRow ? parseFloat(bBidRow.price) : 0;
    const binanceAskPrice = bAskRow ? parseFloat(bAskRow.price) : 0;

    const byBidRow = rows.find((r) => r.bybitBid > 0);
    const byAskRow = [...rows].reverse().find((r) => r.bybitAsk > 0);
    const bybitBidPrice = byBidRow ? parseFloat(byBidRow.price) : 0;
    const bybitAskPrice = byAskRow ? parseFloat(byAskRow.price) : 0;

    const cBidRow = rows.find((r) => r.coinDcxBid > 0);
    const cAskRow = [...rows].reverse().find((r) => r.coinDcxAsk > 0);
    const coinDcxBidPrice = cBidRow ? parseFloat(cBidRow.price) : 0;
    const coinDcxAskPrice = cAskRow ? parseFloat(cAskRow.price) : 0;

    // --- STEP B: Calculate actual cross-venue spreads safely ---
    if (binanceBidPrice > 0 && bybitAskPrice > 0) binancetobybitspread = Math.abs(binanceBidPrice - bybitAskPrice);
    if (binanceBidPrice > 0 && coinDcxAskPrice > 0) binancetoCoinDcxspread = Math.abs(binanceBidPrice - coinDcxAskPrice);
    if (bybitBidPrice > 0 && coinDcxAskPrice > 0) bybittoCoinDcxspread = Math.abs(bybitBidPrice - coinDcxAskPrice);

    // --- STEP C: Calculate Live Liquidity Pressure & Imbalances ---
    let totalBidVolume = 0;
    let totalAskVolume = 0;
    rows.forEach((r) => {
      totalBidVolume += r.totalBid || 0;
      totalAskVolume += r.totalAsk || 0;
    });

    const totalVolume = totalBidVolume + totalAskVolume;
    if (totalVolume > 0) {
      bidPercentage = Math.round((totalBidVolume / totalVolume) * 100);
      askPercentage = Math.round((totalAskVolume / totalVolume) * 100);
      
      const netImbalance = ((totalBidVolume - totalAskVolume) / totalVolume) * 100;
      imbalancePercentage = Math.round(Math.abs(netImbalance));
      imbalanceSign = netImbalance >= 0 ? "+" : "-";
    }
  }
      
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 w-full">
      {/* 1. Arbitrage Radar Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Arbitrage Radar</CardTitle>
          <CardDescription>Fast venue comparison</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ["Binance -> Bybit", binancetobybitspread.toFixed(7), "text-emerald-400"],
            ["Binance -> CoinDCX", binancetoCoinDcxspread.toFixed(7), "text-cyan-400"],
            ["Bybit -> CoinDCX", bybittoCoinDcxspread.toFixed(7), "text-amber-400"],
          ].map(([pair, value, color]) => (
            <div key={pair} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{pair}</span>
              <span className={`font-medium ${color}`}>{loading ? "..." : value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. Liquidity Pressure Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Liquidity Pressure</CardTitle>
          <CardDescription>Current orderbook balance</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bids</span>
              <span>{loading ? "..." : `${bidPercentage}%`}</span>
            </div>
            <Progress value={loading ? 0 : bidPercentage} className="h-2" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Asks</span>
              <span>{loading ? "..." : `${askPercentage}%`}</span>
            </div>
            <Progress value={loading ? 0 : askPercentage} className="h-2" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Imbalance</span>
              <span>{loading ? "..." : `${imbalanceSign}${imbalancePercentage}%`}</span>
            </div>
            <Progress 
              value={loading ? 0 : imbalancePercentage} 
              className="h-2" 
              style={{ backgroundColor: imbalanceSign === "-" ? "rgba(244,63,94,0.2)" : undefined }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Funding Rate Radar Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Funding Rate Radar</CardTitle>
          <CardDescription>Fast venue comparison</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {fundingLoading ? (
            <div className="text-sm text-muted-foreground animate-pulse">Loading funding rates...</div>
          ) : (
            <div className="text-sm text-muted-foreground font-mono font-medium">
              Funding rate: <span className={fundingRateValue >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {fundingRateValue >= 0 ? "+" : ""}{fundingRateValue.toFixed(4)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
