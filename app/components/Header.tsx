import {
  Activity,
  ChevronDown,
  Clock3,
  Layers3,
  Radar,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header(){
    return(
          <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                  >
                    Aggregated market depth
                  </Badge>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight">SOL / USDT</h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Multi-exchange orderbook surface with live venue comparison, spread tracking,
                    and liquidity pressure across the top books.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search pair..." className="pl-9" />
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    Group 0.01
                    <ChevronDown className="ml-2 size-4" />
                  </Button>
                  <Button className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-black hover:opacity-90">
                    Live feed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
    );
}