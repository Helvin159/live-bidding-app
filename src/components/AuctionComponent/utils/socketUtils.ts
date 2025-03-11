import { IBids } from './../../../models/Bids';
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
      name: bidderName,
      auction_id: auctionId,
      timestamp: new Date()
    });
    // Set latest bid
    setLastPlacedBid(parseInt(bid.amount));
    // Set minimum bid
    setMinBid(parseInt(bid.amount) + 50);
    // Set placed bids
    setPlacedBids(() => [...placedBids, bid]);
  });
}

export async function onPlaceNewBid({
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
  placedBids: IBids[];
  bidAmountInput: RefObject<HTMLInputElement | null>;
  nameInput: RefObject<HTMLInputElement | null>;
  setMinBid: Dispatch<SetStateAction<number>>;
  setLastPlacedBid: Dispatch<SetStateAction<number>>;
  setNewBid: Dispatch<SetStateAction<NewBidType>>;
  setPlacedBids: Dispatch<SetStateAction<IBids[]>>;
}) {
  if (bidAmountInput.current?.value) {
    if (parseInt(bidAmountInput.current.value) >= minBid) {
      console.log(bidAmountInput.current?.value);

      const bid = {
        amount: parseInt(bidAmountInput.current?.value),
        name: nameInput.current?.value,
        auction_id: auctionId,
        timestamp: new Date()
      };

      // Reset bidAmountInput
      bidAmountInput.current.value = '';

      // emit placeBid to socket
      socket.emit('placeBid', { auctionId, bid });

      await fetch('/api/post/new-bid', {
        method: 'POST',
        body: JSON.stringify(bid)
      });

      // Set new bid
      setNewBid({
        amount: bid.amount.toString(),
        name: nameInput.current?.value,
        auction_id: auctionId,
        timestamp: new Date()
      });

      // Set latest bid
      setLastPlacedBid(parseInt(bid.amount.toString()));
      // Set minimum bid
      setMinBid(parseInt(bid.amount.toString()));
      // Set placed bids
      setPlacedBids([...placedBids, bid as IBids]);
    }

    // console.log('placeNewBid', placedBids, bidAmountInput?.current?.value);
  }
}
