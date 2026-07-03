import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Radar, Layers3 } from "lucide-react";

export function GlobalCards() {
    return(
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Global Best Bid</p>
                  <TrendingUp className="size-4 text-emerald-400" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-emerald-400">158.28</p>
                <p className="mt-1 text-xs text-muted-foreground">Binance · Bybit</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Global Best Ask</p>
                  <TrendingDown className="size-4 text-rose-400" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-rose-400">158.29</p>
                <p className="mt-1 text-xs text-muted-foreground">Binance</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Tightest Spread</p>
                  <Radar className="size-4 text-cyan-400" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-cyan-400">0.01</p>
                <p className="mt-1 text-xs text-muted-foreground">1 tick difference</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Book Imbalance</p>
                  <Layers3 className="size-4 text-violet-400" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-violet-400">+18.4%</p>
                <p className="mt-1 text-xs text-muted-foreground">Bid side stronger</p>
              </CardContent>
            </Card>
          </div>
    );
}