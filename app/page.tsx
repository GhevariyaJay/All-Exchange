"use client"

import { useState } from "react"
// import Appbar from "./components/Appbar"
// import { Badge } from "@/components/ui/badge"
import { Header } from "./components/Header"
import { Orderbook } from "./components/Orderbook"
import { GlobalCards } from "./components/globlacards"
import { SpreadInfo } from "./components/SpreadInfo"
import { ExchangeData } from "./components/ExchangeData"
import { SideBar, DashboardView } from "./components/SideBar"

export default function OrderbookPage() {
  const [activePair, setActivePair] = useState<string>("SOL/USDT");
  
  // 1. New centralized view state router
  const [currentView, setCurrentView] = useState<DashboardView>("Overview");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_25%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]" />

      <div className="grid min-h-screen grid-cols-12 gap-4 p-4">
        {/* 2. Bind active navigation parameters here */}
        {/* <Appbar /> */}
        <SideBar currentView={currentView} onViewChange={setCurrentView} />  

        <main className="col-span-12 space-y-4 lg:col-span-10">
          <Header currentPair={activePair} onSearchPair={setActivePair} />
          
          {/* 3. DYNAMIC ROUTING RULES: Render panels according to active tab selections */}
          {currentView === "Overview" && (
            <>
              
              <GlobalCards activePair={activePair} />
              <SpreadInfo activePair={activePair} />
              <ExchangeData activePair={activePair} />
              <Orderbook activePair={activePair} />
            </>
          )}

          {currentView === "Aggregated Book" && (
            <>
            <Orderbook activePair={activePair} />
            </>
          )}

          {currentView === "Venue Monitor" && (
            <>

            <ExchangeData activePair={activePair} />
            </>
          )}

          {currentView === "Spread Radar" && (
            <SpreadInfo activePair={activePair} />
          )}

          {/* Placeholders for fields you may design later */}
          {currentView === "Liquidity Walls" && (
            <div className="p-8 border border-dashed rounded-2xl text-center text-muted-foreground bg-card/30">
              Liquidity Wall visualization module loading...
            </div>
          )}

          {currentView === "Alerts" && (
            <div className="p-8 border border-dashed rounded-2xl text-center text-muted-foreground bg-card/30">
              Real-time threshold notification system loading...
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
