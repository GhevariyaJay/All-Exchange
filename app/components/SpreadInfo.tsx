import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
export function SpreadInfo() {
    return(
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Spread Radar</CardTitle>
                <CardDescription>Fast venue comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Binance ↔ Bybit", "0.02", "text-emerald-400"],
                  ["Binance ↔ CoinDCX", "0.04", "text-cyan-400"],
                  ["Bybit ↔ CoinDCX", "0.07", "text-amber-400"],
                ].map(([pair, value, color]) => (
                  <div
                    key={pair}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{pair}</span>
                    <span className={`font-medium ${color}`}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Liquidity Pressure</CardTitle>
                <CardDescription>Current orderbook balance</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bids</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Asks</span>
                    <span>52%</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Imbalance</span>
                    <span>+16%</span>
                  </div>
                  <Progress value={61} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
    );
}