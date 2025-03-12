import { Dispatch, SetStateAction } from 'react';
import { IBids } from '../models/Bids';
import { AuctionsType } from '../models/Auctions';

export const getBidsByAuctionId = async (
  auctionId: string,
  setPlacedBids: Dispatch<SetStateAction<IBids[]>>
) => {
  const res = await fetch('/api/db/post/auctions/bids-by-auction-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ auctionId: auctionId })
  });
  const data = await res.json();

  setPlacedBids(JSON.parse(data.message));
};

export const getAuctionById = async (
  auctionId: string,
  setAuction: Dispatch<SetStateAction<AuctionsType | null>>
) => {
  const res = await fetch('/api/db/post/auctions/auction-by-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ auctionId: auctionId })
  });
  const data = await res.json();
  const parsed = JSON.parse(data.message);

  setAuction(parsed[0]);
};
