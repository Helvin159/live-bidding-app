'use client';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../../lib/socket';

// Types
import { NewBidType, PlacedBidsType } from './utils/types';

// Components
import CurrentBids from './components/CurrentBids';
import LatestBids from './components/LatestBids';
import { placeNewBid } from './utils/socketUtils';

const AuctionComponent = ({
  auctionId = '67cb4a0ac982beec667bb5bf'
}: {
  auctionId?: string;
}) => {
  const [newBid, setNewBid] = useState<NewBidType>(null);
  const [placedBids, setPlacedBids] = useState<PlacedBidsType>([]);
  const [lastPlacedBid, setLastPlacedBid] = useState<number>(0);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [minBid, setMinBid] = useState<number>(0);

  // Input Refs
  const bidAmountInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    socket.emit('joinAuction', auctionId);

    setLastPlacedBid(placedBids.length - 1);

    // return () => {
    //   socket.off('newBid');
    //   socket.emit('leaveAuction', auctionId);
    // };
  }, [newBid, placedBids.length, placedBids, disableSubmit, auctionId]);

  socket.on('newBid', (bid = newBid) => {
    setPlacedBids(() => [...placedBids, bid]);
    setMinBid(bid.amount);

    console.log(bid, 'new BID');
  });

  const handleSubmit = () => {
    console.log('handleSubmit', placedBids, bidAmountInput?.current?.value);
    console.log(bidAmountInput.current?.value);

    placeNewBid({
      auctionId,
      minBid,
      placedBids,
      bidAmountInput,
      nameInput,
      setNewBid,
      setMinBid,
      setLastPlacedBid,
      setPlacedBids
    });
  };

  const handleOnChange = () => {
    const latestPlacedBid = parseInt(placedBids[lastPlacedBid]?.amount ?? '0');
    const newBidToPlace = parseInt(bidAmountInput.current?.value ?? '0');

    console.log(
      'on change',
      latestPlacedBid,
      bidAmountInput.current?.value,
      newBidToPlace < latestPlacedBid,
      !newBidToPlace
    );

    if (!newBidToPlace) {
      setDisableSubmit(true);
      return;
    }

    setDisableSubmit(newBidToPlace <= latestPlacedBid);
    return;
  };

  return (
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
  );
};

export default AuctionComponent;
