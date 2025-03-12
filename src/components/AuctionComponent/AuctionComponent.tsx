'use client';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../../lib/socket';

// Types
import { AuctionComponentType, NewBidType } from './utils/types';
import { AuctionsType } from '../../models/Auctions';

// Utils
import {
  getAuctionById,
  getBidsByAuctionId,
  placeNewBid
} from '../../lib/server-utis';

// Models
import { IBids } from '../../models/Bids';

// Components
import CurrentBids from './components/CurrentBids';
import LatestBids from './components/LatestBids';

const AuctionComponent = ({
  auctionId = '67cb4a0ac982beec667bb5bf'
}: AuctionComponentType) => {
  // State variables
  const [newBid, setNewBid] = useState<NewBidType>(null);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [placedBids, setPlacedBids] = useState<IBids[]>([]);
  const [auction, setAuction] = useState<AuctionsType | null>(null);

  // Input Refs
  const bidAmountInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Emit joinAuction
    socket.emit('joinAuction', auctionId);

    // Get auction with auctionId
    getAuctionById(auctionId, setAuction);

    // Get all bids with the auctionId
    getBidsByAuctionId(auctionId, setPlacedBids);

    return () => {
      socket.off('newBid');
      socket.emit('leaveAuction', auctionId);
    };
  }, [newBid, placedBids.length, disableSubmit, auctionId]);

  socket.on('newBid', (bid = newBid) => {
    setPlacedBids(() => [...placedBids, bid]);

    console.log(bid, 'new BID came in');
  });

  console.log(
    'placedBids',
    placedBids,
    placedBids[placedBids.length - 1]?.amount,
    auction
  );

  const handleSubmit = async () => {
    const bid = {
      amount: parseInt(bidAmountInput.current?.value ?? '0'),
      name: nameInput.current?.value,
      auction_id: auctionId,
      timestamp: new Date()
    };

    try {
      // Place New Bid to MongoDB
      await placeNewBid(bid);

      // Emit placeBid to socket
      socket.emit('placeBid', { auctionId, bid });

      // Set new bid
      setNewBid({
        amount: bid.amount.toString(),
        name: nameInput.current?.value,
        auction_id: auctionId,
        timestamp: new Date()
      });

      // Set placed bids
      setPlacedBids([...placedBids, bid as IBids]);

      // Reset input refs
      if (bidAmountInput.current && nameInput.current) {
        // Reset bidAmountInput
        bidAmountInput.current.value = '';
        nameInput.current.value = '';
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleOnChange = () => {
    const latestPlacedBid = placedBids[placedBids.length - 1].amount;
    const newBidToPlace = parseInt(bidAmountInput.current?.value ?? '0');
    if (!newBidToPlace) {
      setDisableSubmit(true);
      return;
    }
    setDisableSubmit(newBidToPlace <= latestPlacedBid);
    return;
  };

  return (
    <>
      <section className='tw-max-w-3xl tw-p-8 tw-mx-auto tw-text-center'>
        <h1 className='tw-text-3xl'>Welcome to the Auction</h1>
        <p>
          This auction is being held for lead named: {auction?.lead_name}{' '}
          interested in purchasing a home of up $200,000
        </p>
      </section>
      <div className='tw-w-full tw-max-w-xl tw-mx-auto tw-flex tw-justify-around tw-items-baseline tw-flex-wrap tw-p-4'>
        <div className='tw-basis-full md:tw-basis-1/2'>
          <h2 className='tw-text-2xl'>Lead Details:</h2>
          <div className='tw-pb-4'>
            <h3>Name: {auction?.lead_name}</h3>
            <p>Description: {auction?.description}</p>
          </div>
          {placedBids.length > 0 && (
            <LatestBids minBid={placedBids[placedBids.length - 1].amount} />
          )}
        </div>
        <div className='tw-basis-full md:tw-basis-1/2'>
          <div className='tw-mx-auto tw-py-8'>
            <label htmlFor='nameInput'>Name</label>
            <input
              type='text'
              ref={nameInput}
              id='nameInput'
              placeholder='Name'
              className='tw-w-full tw-h-8 tw-shadow-lg tw-rounded tw-p-2'
            />
          </div>

          <div className='tw-mx-auto tw-py-8'>
            <label htmlFor='bidInput'>How much will you like to bid?</label>
            <input
              type='number'
              step={25}
              ref={bidAmountInput}
              onChange={handleOnChange}
              id='bidInput'
              placeholder='Bid'
              className='tw-w-full tw-h-8 tw-shadow-lg tw-rounded tw-p-2'
            />
          </div>

          <div>
            <button
              className='tw-bg-black tw-p-2 tw-shadow tw-rounded tw-text-white'
              disabled={disableSubmit}
              onClick={handleSubmit}
            >
              Place Bid
            </button>
          </div>

          {placedBids.length > 0 && <CurrentBids placedBids={placedBids} />}
        </div>
      </div>
    </>
  );
};

export default AuctionComponent;
