"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Explicit string literals matching view keys
export type DashboardView = 
  | "Overview"
  | "Aggregated Book"
  | "Venue Monitor"
  | "Spread Radar"
  | "Liquidity Walls"
  | "Alerts";

const MENU_ITEMS: DashboardView[] = [
  "Overview",
  "Aggregated Book",
  "Venue Monitor",
  "Spread Radar",
  "Liquidity Walls",
  "Alerts",
];

interface SideBarProps {
  currentView: DashboardView[];
  onViewChange: (view: DashboardView) => void;
}

export function SideBar({ currentView, onViewChange }: SideBarProps) {
  return (
    <aside className="col-span-12 lg:col-span-2">
      <Card className="h-full border-border/60 bg-card/70 backdrop-blur">
        <CardContent className="p-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible items-center lg:items-stretch scrollbar-none">
          {MENU_ITEMS.map((item) => {
            const isSelected = currentView.includes(item);
            
            return (
              <Button
                key={item}
                variant={isSelected ? "secondary" : "ghost"}
                onClick={() => onViewChange(item)}
                className={`h-10 w-auto lg:w-full min-w-[130px] lg:min-w-0 justify-between rounded-xl px-4 flex-shrink-0 transition-colors ${
                  isSelected ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{item}</span>
                {item === "Aggregated Book" ? (
                  <Sparkles className={`size-4 ${isSelected ? "text-cyan-400" : "text-muted-foreground"}`} />
                ) : null}
              </Button>
            );
          })}

          <Separator className="hidden lg:block my-3" />
          
          <Card className="hidden lg:block border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 shadow-sm w-full">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                System status
              </p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-semibold">5 / 5</p>
                  <p className="text-xs text-muted-foreground">Healthy venues</p>
                </div>
                <Activity className="size-4.5 text-cyan-400" />
              </div>
              <Progress value={100} className="mt-4 h-1.5" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </aside>
  );
}
