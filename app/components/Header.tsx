import { useState, KeyboardEvent } from "react";
import { ChevronDown, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPair: string;
  onSearchPair: (newPair: string) => void;
}

export function Header({ currentPair, onSearchPair }: HeaderProps) {
  // 1. Local state to hold the input text as the user types
  const [searchInput, setSearchInput] = useState<string>(currentPair);

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim().toUpperCase();
    if (trimmed) {
      onSearchPair(trimmed);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
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
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{currentPair}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Multi-exchange orderbook surface with live venue comparison, spread tracking,
              and liquidity pressure across the top books.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pair (e.g. BTC/USDT)..." 
                className="pl-9 uppercase" 
              />
            </div>
            <Button variant="outline" className="rounded-xl">
              Group 0.01
              <ChevronDown className="ml-2 size-4" />
            </Button>
            <Button 
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-black hover:opacity-90 font-medium" 
              onClick={handleSearchSubmit}
            >
              Live feed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
