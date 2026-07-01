"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderBookRow {
  bidAmount: number;
  bidQty: number;
  askAmount: number;
  askQty: number;
}

export function CardEdgeToEdge() {
  const [orderBook, setOrderBook] = useState<OrderBookRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Point this directly to your Express server running on port 5000
        const res = await axios.get("http://localhost:5000/api/orderbook"); 
        
        if (res.data && res.data.success) {
          setOrderBook(res.data.data);
          setErrorMsg(null); // Clear errors on success
        }
      } catch (err) {
        console.error("API error feeding card view:", err);
        setErrorMsg("Failed to connect to local data server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // 1-second interval tracking loop
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mx-auto w-full max-w-sm border-zinc-800 bg-black text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-tight">CoinDCX Book</CardTitle>
        <CardDescription className="text-zinc-400 text-xs">
          Real-time order depth for B-SOL_USDT
        </CardDescription>
      </CardHeader>
      
      <CardContent className="-mb-(--card-spacing) p-0">
        {/* Table column subheadings */}
        <div className="grid grid-cols-2 gap-x-4 border-t border-zinc-800/80 px-(--card-spacing) py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-muted/20">
          <div className="flex justify-between">
            <span>Bid Price</span>
            <span>Size</span>
          </div>
          <div className="flex justify-between">
            <span>Ask Price</span>
            <span>Size</span>
          </div>
        </div>

        {/* Scrollable Container mapping live rows */}
        <div className="-mx-(--card-spacing) h-64 overflow-y-scroll border-t border-zinc-800/60 bg-muted/10 px-(--card-spacing) py-2 text-xs font-mono">
          {errorMsg ? (
            <div className="py-8 text-center text-red-400 text-xs px-4">
              {errorMsg} <br />
              <span className="text-[10px] text-zinc-500">Verify your backend is running on port 5000</span>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-zinc-500 font-medium animate-pulse">
              Syncing order streams...
            </div>
          ) : (
            <div className="space-y-1">
              {orderBook.map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-x-4 py-0.5 hover:bg-zinc-900/40 rounded px-1 transition-colors">
                  
                  {/* Left Column Group: Bids (Green / Buys) */}
                  <div className="flex justify-between pr-0.5">
                    <span className="text-green-500 font-medium">{row.bidAmount.toFixed(2)}</span>
                    <span className="text-zinc-400">{row.bidQty.toFixed(2)}</span>
                  </div>

                  {/* Right Column Group: Asks (Red / Sells) */}
                  <div className="flex justify-between pl-0.5">
                    <span className="text-red-500 font-medium">{row.askAmount.toFixed(2)}</span>
                    <span className="text-zinc-400">{row.askQty.toFixed(2)}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 pt-6">
        <Button size="sm" variant="outline" className="text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-white text-xs">
          View Charts
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs">
          Trade Now
        </Button>
      </CardFooter>
    </Card>
  );
}
