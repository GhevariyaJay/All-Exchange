import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BidBar } from "./BidBar";
import { AskBar } from "./AskBar";
import { useOrderbook } from "../hooks/useOrderbook";

export function Orderbook(){
    const { rows, loading } = useOrderbook();

    return(
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-12 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Aggregated Order Book (SPOT)</CardTitle>
                  <CardDescription>Combined L2 depth across major venues</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Heatmap
                  </Button>
                  <Button variant="outline" size="sm">
                    Depth 50
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto rounded-2xl border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead>Price</TableHead>
                        <TableHead>Total Bid</TableHead>
                        <TableHead>Binance</TableHead>
                        <TableHead>Bybit</TableHead>
                        <TableHead>CoinDCX</TableHead>
                        <TableHead>Total Ask</TableHead>
                        <TableHead>Binance</TableHead>
                        <TableHead>Bybit</TableHead>
                        <TableHead>CoinDCX</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                            Connecting to venues...
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((row, i) => (
                          <TableRow key={i} className="hover:bg-muted/20">
                            <TableCell className="font-medium text-cyan-300">{row.price}</TableCell>
                            <TableCell>
                              <BidBar value={row.totalBid} />
                            </TableCell>
                            <TableCell>{row.binanceBid}</TableCell>
                            <TableCell>{row.bybitBid}</TableCell>
                            
                            {/* CHANGED HERE: Mapping directly to coinDcxBid */}
                            <TableCell>{row.coinDcxBid}</TableCell> 
                            
                            <TableCell>
                              <AskBar value={row.totalAsk} />
                            </TableCell>
                            <TableCell>{row.binanceAsk}</TableCell>
                            <TableCell>{row.bybitAsk}</TableCell>
                            
                            {/* CHANGED HERE: Mapping directly to coinDcxAsk */}
                            <TableCell>{row.coinDcxAsk}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>  
    );
}
