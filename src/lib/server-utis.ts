import { Dispatch, SetStateAction } from 'react';
import { IBids } from '../models/Bids';
import Auctions, { AuctionsType } from '../models/Auctions';

export const getBidsByAuctionId = async (
  auctionId: string,
  setPlacedBids: Dispatch<SetStateAction<IBids[]>>
) => {
  const res = await fetch('/api/db/post/bids/bids-by-auction-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ auctionId: auctionId })
  });
  const data = await res.json();
  if (data) {
    const parsed = JSON.parse(data.message);
    setPlacedBids(parsed);
  }
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
    body: JSON.stringify({ auctionId })
  });
  const data = await res.json();
  console.log(data, 'data');
  if (data) {
    // console.log('from getAuctionById', JSON.parse(data.message));
    const parsed = JSON.parse(data.message);
    setAuction(parsed);
  }
};

export async function createNewAuction({
  name,
  phone,
  email,
  description,
  preApprovedAmt,
  creditScore,
  income,
  assets,
  sellingCurrentHome
}: {
  name: string;
  phone: string;
  email: string;
  description: string;
  preApprovedAmt: number;
  creditScore: number;
  income: number;
  assets: number;
  sellingCurrentHome: boolean;
}) {
  try {
    await Auctions.create({
      lead_name: name,
      phone: phone,
      email: email,
      description: description,
      pre_approved_amt: preApprovedAmt,
      credit_score: creditScore,
      income: income,
      assets: assets,
      selling_current_home: sellingCurrentHome
    });
  } catch (error: unknown) {
    console.error(error);
  }
}

export async function placeNewBid(bid: {
  amount: number;
  name: string | undefined;
  auction_id: string;
  timestamp: Date;
}) {
  await fetch('/api/db/post/bids/place-new-bid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bid)
  });
}
