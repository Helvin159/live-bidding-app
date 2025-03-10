export type NewBidType = {
  amount: string | undefined;
  name: string | undefined;
  auction_id: string;
  timestamp: Date;
} | null;

export type PlacedBidsType = {
  amount: string | undefined;
  bidder: string | undefined;
  auctionId: string;
}[];
