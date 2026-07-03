"use client"

import { Bell, ChevronDown, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AppBarProps = {
  activeTab?: "spot" | "options" | "strategy"
  onTabChange?: (value: "spot" | "options" | "strategy") => void
}

export default function AppBar({
  activeTab = "spot",
  onTabChange,
}: AppBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-sm font-bold text-black shadow-lg shadow-cyan-500/20">
            OB
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                Depth Fusion
              </h1>
              <Badge
                variant="outline"
                className="hidden rounded-full border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-[10px] font-medium text-emerald-300 sm:inline-flex"
              >
                Live
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              Multi-exchange trading workspace
            </p>
          </div>
        </div>

        <div className="flex w-full justify-center lg:flex-1">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              onTabChange?.(value as "spot" | "options" | "strategy")
            }
            className="w-full lg:w-auto"
          >
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:grid-cols-3 lg:min-w-[560px]">
              <TabsTrigger
                value="spot"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-violet-500 data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/20"
              >
                Spot Orderbook
              </TabsTrigger>

              <TabsTrigger
              
                value="options"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-violet-500 data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/20"
              >
                Options
              </TabsTrigger>

              <TabsTrigger
                value="strategy"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-violet-500 data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/20"
              >
                Strategy Orderbook
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="relative hidden xl:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pair..."
              className="h-10 w-[220px] rounded-xl border-white/10 bg-white/[0.04] pl-9 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-cyan-500/40"
            />
          </div>

          <Button
            variant="outline"
            className="h-10 rounded-xl border-white/10 bg-white/[0.04] px-4 text-sm text-foreground hover:bg-white/[0.08]"
          >
            SOL/USDT
            <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
          </Button>

          <Button
            
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}