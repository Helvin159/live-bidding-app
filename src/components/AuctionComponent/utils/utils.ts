export const handleSubmit = (
  setNewBid,
  setBids,
  bidAmountInput,
  nameInput,
  socket,
  bids
) => {
  console.log('handleSubmit', bids, bidAmountInput?.current?.value);

  const auctionId = 'some-id';

  const bid = {
    amount: bidAmountInput.current?.value,
    bidder: nameInput.current?.value,
    auctionId
  };

  socket.emit('placeBid', { auctionId, bid });
  setNewBid({
    amount: bid.amount,
    bidder: nameInput.current?.value,
    auctionId
  });
  setBids([...bids, bid]);
};
