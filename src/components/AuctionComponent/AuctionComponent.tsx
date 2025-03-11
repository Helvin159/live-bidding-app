'use client';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';

// Types
import { AuctionComponentType, NewBidType } from './utils/types';

// Utils
import { getAuctionById, getBidsByAuctionId } from '@/lib/server-utis';
import { onPlaceNewBid } from './utils/socketUtils';

// Models
import { IBids } from '@/models/Bids';

// Components
import CurrentBids from './components/CurrentBids';
import LatestBids from './components/LatestBids';
import { AuctionsType } from '@/models/Auctions';

const AuctionComponent = ({
  auctionId = '67cb4a0ac982beec667bb5bf'
}: AuctionComponentType) => {
  const [newBid, setNewBid] = useState<NewBidType>(null);
  const [lastPlacedBid, setLastPlacedBid] = useState<number>(0);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [minBid, setMinBid] = useState<number>(0);
  const [placedBids, setPlacedBids] = useState<IBids[]>([]);
  const [auction, setAuction] = useState<AuctionsType | null>(null);

  // Input Refs
  const bidAmountInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

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
    setMinBid(bid.amount);

    console.log(bid, 'new BID came in');
  });

  const handleSubmit = () => {
    console.log('handleSubmit', placedBids, bidAmountInput?.current?.value);
    console.log(bidAmountInput.current?.value);

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

      // Set placed bids
      setPlacedBids([...placedBids, bid as IBids]);
    };

    newBid();
  };

  const handleOnChange = () => {
    const latestPlacedBid = placedBids[lastPlacedBid]?.amount ?? '0';
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
      <div className='tw-w-full tw-max-w-xl tw-mx-auto'>
        <LatestBids
          lastPlacedBid={lastPlacedBid}
          placedBids={placedBids}
          newBid={newBid}
          minBid={minBid}
        />

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
            min={placedBids[lastPlacedBid]?.amount}
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

          <CurrentBids placedBids={placedBids} />
        </div>
      </div>
    </>
  );
};

export default AuctionComponent;
