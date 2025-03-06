export type NewBidType = {
  amount: string | undefined;
  bidder: string | undefined;
  auctionId: string;
} | null;

export type PlacedBidsType = {
  amount: string | undefined;
  bidder: string | undefined;
  auctionId: string;
}[];
