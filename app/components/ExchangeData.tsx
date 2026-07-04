import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock3 } from "lucide-react";
import { useOrderbook } from "../hooks/useOrderbook";

export function ExchangeData({ activePair }: { activePair: string }) {
  const { rows, loading } = useOrderbook(activePair);

  // 1. Initialize data objects with 7-decimal place defaults
  let binanceData = { bid: "0.0000000", ask: "0.0000000", spread: "0.0000000" };
  let bybitData = { bid: "0.0000000", ask: "0.0000000", spread: "0.0000000" };
  let coinDcxData = { bid: "0.0000000", ask: "0.0000000", spread: "0.0000000" };

  if (!loading && rows.length > 0) {
    // Find highest bid and lowest ask for Binance
    const bBid = rows.find((r) => r.binanceBid > 0);
    const bAsk = [...rows].reverse().find((r) => r.binanceAsk > 0);
    if (bBid && bAsk) {
      binanceData = {
        bid: parseFloat(bBid.price).toFixed(7),
        ask: parseFloat(bAsk.price).toFixed(7),
        spread: Math.abs(parseFloat(bAsk.price) - parseFloat(bBid.price)).toFixed(7)
      };
    }

    // Find highest bid and lowest ask for Bybit
    const byBid = rows.find((r) => r.bybitBid > 0);
    const byAsk = [...rows].reverse().find((r) => r.bybitAsk > 0);
    if (byBid && byAsk) {
      bybitData = {
        bid: parseFloat(byBid.price).toFixed(7),
        ask: parseFloat(byAsk.price).toFixed(7),
        spread: Math.abs(parseFloat(byAsk.price) - parseFloat(byBid.price)).toFixed(7)
      };
    }

    // Find highest bid and lowest ask for CoinDCX
    const cBid = rows.find((r) => r.coinDcxBid > 0);
    const cAsk = [...rows].reverse().find((r) => r.coinDcxAsk > 0);
    if (cBid && cAsk) {
      coinDcxData = {
        bid: parseFloat(cBid.price).toFixed(7),
        ask: parseFloat(cAsk.price).toFixed(7),
        spread: Math.abs(parseFloat(cAsk.price) - parseFloat(cBid.price)).toFixed(7)
      };
    }
  }

  // 2. Build the venues array locally
  const venues = [
    {
      name: "Binance",
      status: loading ? "Connecting" : "Live",
      bid: binanceData.bid,
      ask: binanceData.ask,
      spread: binanceData.spread,
      latency: "45ms",
    },
    {
      name: "Bybit",
      status: loading ? "Connecting" : "Live",
      bid: bybitData.bid,
      ask: bybitData.ask,
      spread: bybitData.spread,
      latency: "62ms",
    },
    {
      name: "CoinDCX",
      status: loading ? "Connecting" : "Live",
      bid: coinDcxData.bid,
      ask: coinDcxData.ask,
      spread: coinDcxData.spread,
      latency: "110ms",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {venues.map((venue) => (
        <Card
          key={venue.name}
          className="overflow-hidden border-border/60 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{venue.name}</CardTitle>
                <CardDescription>Realtime venue feed</CardDescription>
              </div>
              <Badge
                variant={venue.status === "Live" ? "secondary" : "outline"}
                className={
                  venue.status === "Live"
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                }
              >
                {venue.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 
              UI ADJUSTMENT: Shifted inner grid to dynamically split on desktop 
              and stack smoothly vertically on compact screens to provide 7-decimal text headroom.
            */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
              
              {/* Bid Block */}
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 min-w-0 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
                <p className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">Bid</p>
                <p className="font-semibold text-emerald-400 text-xs sm:text-sm md:text-base tracking-tight break-all select-all sm:mt-1">
                  {venue.bid}
                </p>
              </div>
              
              {/* Ask Block */}
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 min-w-0 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
                <p className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">Ask</p>
                <p className="font-semibold text-rose-400 text-xs sm:text-sm md:text-base tracking-tight break-all select-all sm:mt-1">
                  {venue.ask}
                </p>
              </div>
              
              {/* Spread Block */}
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 min-w-0 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
                <p className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">Spread</p>
                <p className="font-semibold text-cyan-300 text-xs sm:text-sm md:text-base tracking-tight break-all select-all sm:mt-1">
                  {venue.spread}
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-0.5">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4" />
                Latency
              </span>
              <span>{venue.latency}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
