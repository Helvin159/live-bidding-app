import { Dispatch, RefObject, SetStateAction } from 'react';
import { socket } from '../../../lib/socket';
import { NewBidType, PlacedBidsType } from './types';
// import { MongoClient } from 'mongodb';

// const mongoClient = new MongoClient(
//   process.env.MONGODB_URI ?? 'mongodb://localhost:27017/bidding-app'
// );

export function onNewBidPlaced({
  auctionId,
  placedBids,
  newBid,
  bidderName = 'John Doe',
  setLastPlacedBid,
  setMinBid,
  setNewBid,
  setPlacedBids
}: {
  auctionId: string;
  placedBids: PlacedBidsType;
  newBid: NewBidType;
  bidderName?: string;
  setLastPlacedBid: Dispatch<SetStateAction<number>>;
  setMinBid: Dispatch<SetStateAction<number>>;
  setNewBid: Dispatch<SetStateAction<NewBidType>>;
  setPlacedBids: Dispatch<SetStateAction<PlacedBidsType>>;
}) {
  // socket.on('newBidPlaced', (bid = newBid) => {
  //   console.log('onNewBid', bid);

  //   setNewBid({
  //     amount: bid.amount,
  //     bidder: bidderName,
  //     auctionId
  //   });
  //   // Set latest bid
  //   setLastPlacedBid(parseInt(bid.amount));
  //   // Set minimum bid
  //   setMinBid(parseInt(bid.amount) + 50);
  //   // Set placed bids
  //   setPlacedBids(() => [...placedBids, bid]);
  // });

  socket.on('newBidPlaced', (bid = newBid) => {
    console.log('newBidPlaced', bid);

    setNewBid({
      amount: bid.amount,
      bidder: bidderName,
      auctionId
    });
    // Set latest bid
    setLastPlacedBid(parseInt(bid.amount));
    // Set minimum bid
    setMinBid(parseInt(bid.amount) + 50);
    // Set placed bids
    setPlacedBids(() => [...placedBids, bid]);
  });
}

export function placeNewBid({
  auctionId,
  minBid,
  placedBids,
  bidAmountInput,
  nameInput,
  setNewBid,
  setMinBid,
  setLastPlacedBid,
  setPlacedBids
}: {
  auctionId: string;
  minBid: number;
  placedBids: PlacedBidsType;
  bidAmountInput: RefObject<HTMLInputElement | null>;
  nameInput: RefObject<HTMLInputElement | null>;
  setMinBid: Dispatch<SetStateAction<number>>;
  setLastPlacedBid: Dispatch<SetStateAction<number>>;
  setNewBid: Dispatch<SetStateAction<NewBidType>>;
  setPlacedBids: Dispatch<SetStateAction<PlacedBidsType>>;
}) {
  if (bidAmountInput.current?.value) {
    if (parseInt(bidAmountInput.current.value) >= minBid) {
      console.log(bidAmountInput.current?.value);
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

      bidAmountInput.current.value = '';

      // Set latest bid
      setLastPlacedBid(parseInt(bid.amount));
      // Set minimum bid
      setMinBid(parseInt(bid.amount));
      // Set placed bids
      setPlacedBids([...placedBids, bid]);
    }

    // console.log('placeNewBid', placedBids, bidAmountInput?.current?.value);
  }
}
