export const placeNewBid = async ({
  name,
  amount,
  auctionId
}: {
  name: string;
  amount: number;
  auctionId: string;
}) => {
  const res = await fetch('/api/db/post/new-bid', {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      amount: amount,
      auction_id: auctionId,
      timestamp: new Date()
    })
  });

  const data = await res.json();

  return data;
};

export default placeNewBid;
