export type OrderBookRow = {
  bidAmount: number;
  bidQty: number;
  askAmount: number;
  askQty: number;
};

export type PriceData = {
  totalProfit: number;
  books: OrderBookRow[];
};