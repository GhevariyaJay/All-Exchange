import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock3 } from "lucide-react";

const venues = [
  { name: "Binance", bid: "158.28", ask: "158.29", spread: "0.01", status: "Live", latency: "12ms" },
  { name: "Bybit", bid: "158.27", ask: "158.30", spread: "0.03", status: "Live", latency: "17ms" },
  { name: "OKX", bid: "158.26", ask: "158.31", spread: "0.05", status: "Live", latency: "22ms" },
]

export function ExchangeData() {
    return(
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {venues.map((venue) => (
              <Card
                key={venue.name}
                className="border-border/60 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur"
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Bid</p>
                      <p className="mt-2 font-semibold text-emerald-400">{venue.bid}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Ask</p>
                      <p className="mt-2 font-semibold text-rose-400">{venue.ask}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Spread</p>
                      <p className="mt-2 font-semibold text-cyan-300">{venue.spread}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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