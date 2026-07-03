import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
export function SideBar(){
    return(
        <aside className="col-span-12 lg:col-span-2">
          <Card className="h-full border-border/60 bg-card/70 backdrop-blur">
            <CardContent className="space-y-2">
              {[
                "Overview",
                "Aggregated Book",
                "Venue Monitor",
                "Spread Radar",
                "Liquidity Walls",
                "Alerts",
              ].map((item, index) => (
                <Button
                  key={item}
                  variant={index === 1 ? "secondary" : "ghost"}
                  className="h-11 w-full justify-between rounded-xl">
                  <span>{item}</span>
                  {index === 1 ? <Sparkles className="size-4" /> : null}
                </Button>
              ))}
              <Separator className="my-4" />
              <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    System status
                  </p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold">5 / 5</p>
                      <p className="text-sm text-muted-foreground">Healthy venues</p>
                    </div>
                    <Activity className="size-5 text-cyan-400" />
                  </div>
                  <Progress value={88} className="mt-4 h-2" />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </aside>
    );
}