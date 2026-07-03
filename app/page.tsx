"use client"

import  Appbar  from "./components/Appbar"
import { Badge } from "@/components/ui/badge"
import  { Header } from "./components/Header"
import { Orderbook } from "./components/Orderbook"

import { GlobalCards } from "./components/globlacards"
import { SpreadInfo } from "./components/SpreadInfo"
import { ExchangeData } from "./components/ExchangeData"
import { SideBar } from "./components/SideBar"


export default function OrderbookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_25%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]" />

      <div className="grid min-h-screen grid-cols-12 gap-4 p-4">
        
        
        <SideBar />  
        <main className="col-span-12 space-y-4 lg:col-span-10">
          <Header />
          <GlobalCards />
          <SpreadInfo />
          <ExchangeData />
          <Orderbook /> 
                

          
        </main>
      </div>
    </div>
  )
}