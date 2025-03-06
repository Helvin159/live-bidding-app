'use client';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../../lib/socket';
import { NewBidType, PlacedBidsType } from './utils/types';

type LatestBidsProps = {
  newBid: NewBidType;
  placedBids: PlacedBidsType;
  lastPlacedBid: number;
};

const AuctionComponent = ({
  auctionId = 'some-id'
}: {
  auctionId?: string;
}) => {
  const [newBid, setNewBid] = useState<NewBidType>(null);
  const [placedBids, setPlacedBids] = useState<PlacedBidsType>([]);
  const [lastPlacedBid, setLastPlacedBid] = useState<number>(0);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  // Input Refs
  const bidAmountInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const auctionId = 'some-id';
    socket.emit('joinAuction', auctionId);

    socket.on('newBid', (bid = newBid) => {
      setPlacedBids(() => [...placedBids, bid]);
    });

    setLastPlacedBid(placedBids.length - 1);

    if (bidAmountInput.current) {
      if (!bidAmountInput.current.value) {
        setDisableSubmit(true);
        return;
      }
    }

    return () => {
      socket.off('newBid');
      socket.emit('leaveAuction', auctionId);
    };
  }, [newBid, placedBids.length, placedBids, disableSubmit]);

  const handleSubmit = () => {
    console.log('handleSubmit', placedBids, bidAmountInput?.current?.value);

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

    if (bidAmountInput.current) {
      bidAmountInput.current.value = '';
    }

    setPlacedBids([...placedBids, bid]);
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <LatestBids
        lastPlacedBid={lastPlacedBid}
        placedBids={placedBids}
        newBid={newBid}
      />
      <label htmlFor='nameInput'>Name</label>
      <input
        type='text'
        ref={nameInput}
        id='nameInput'
        style={{ width: '100%', height: '2rem' }}
      />
      <label htmlFor='bidInput'>How much will you like to bid?</label>

      <input
        type='number'
        step={25}
        ref={bidAmountInput}
        min={placedBids[lastPlacedBid]?.amount}
        onChange={handleOnChange}
        id='bidInput'
        style={{ width: '100%', height: '2rem' }}
      />
      <div style={{ padding: '1rem 0 0 0' }}>
        <button disabled={disableSubmit} onClick={handleSubmit}>
          Place Bid
        </button>

        <CurrentBids placedBids={placedBids} />
      </div>
    </div>
  );
};

export default AuctionComponent;

function LatestBids({ newBid, placedBids, lastPlacedBid }: LatestBidsProps) {
  return (
    <>
      {newBid ? (
        <div>
          <h2>Latest Bid</h2>
          {/* <p>{newBid.bidder}</p> */}
          <p style={{ fontSize: '24px' }}>${parseInt(newBid?.amount ?? '0')}</p>
        </div>
      ) : null}

      <p style={{ fontSize: '24px' }}>
        Minimum bid:
        {placedBids.length > 0 &&
        typeof placedBids[lastPlacedBid]?.amount === 'string'
          ? `$${parseInt(placedBids[lastPlacedBid]?.amount) + 50}`
          : null}
      </p>
    </>
  );
}

function CurrentBids({ placedBids }: { placedBids: PlacedBidsType }) {
  return (
    <>
      <div style={{ padding: '1rem 0 ' }}>
        <p>Current Bids:</p>
        <ul>
          {placedBids.map((i, k) => (
            <li key={k}>${i.amount}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
