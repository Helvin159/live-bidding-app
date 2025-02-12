'use client';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';

const AuctionComponent = () => {
  const [bids, setBids] = useState<{ bid: string; bidder: string }[]>([]);
  const [newBid, setNewBid] = useState<string>('');
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const auctionId = 'some-id';
    socket.emit('joinAuction', auctionId);

    socket.on('newBid', (bid = newBid) => {
      setBids((prevBids) => [...prevBids, bid]);
    });

    return () => {
      socket.off('newBid');
      socket.emit('leaveAuction', auctionId);
    };
  }, [newBid]);

  const handleSubmit = () => {
    console.log('handleSubmit', bids, input?.current?.value);

    const auctionId = 'some-id';

    const bid = {
      amount: input.current?.value,
      bidder: 'Bidder Name'
    };

    socket.emit('placeBid', { auctionId, bid });
    setNewBid(bid.amount ?? '');
  };

  return (
    <div>
      <h1>Testing</h1>
      <label htmlFor='bidInput'>How much will you like to bid?</label>
      <input
        type='number'
        ref={input}
        id='bidInput'
        style={{ width: '100%', height: '2rem' }}
      />
      <button onClick={handleSubmit}>Place Bid</button>
      <div>
        Current Bids:
        <ul>
          {bids.map((i, k) => (
            <li key={k}>{i.bid}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuctionComponent;
