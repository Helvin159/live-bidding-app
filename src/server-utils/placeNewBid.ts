const newBid = async () => {
  const bid = {
    amount: parseInt(bidAmountInput.current?.value ?? '0'),
    name: nameInput.current?.value,
    auction_id: auctionId,
    timestamp: new Date()
  };

  await fetch('/api/db/post/bids/place-new-bid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bid)
  });
};
