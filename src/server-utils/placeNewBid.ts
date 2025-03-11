const placeNewBid = async (bid: {
  amount: number;
  name: string | undefined;
  auction_id: string;
  timestamp: Date;
}) => {
  await fetch('/api/db/post/bids/place-new-bid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bid)
  });
};

export default placeNewBid;
