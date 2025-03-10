import { NewBidType, PlacedBidsType } from '../utils/types';

type LatestBidsProps = {
  newBid: NewBidType;
  placedBids: PlacedBidsType;
  lastPlacedBid: number;
  minBid: number;
};

function LatestBids({
  newBid,
  placedBids,
  lastPlacedBid,
  minBid
}: LatestBidsProps) {
  return (
    <>
      {newBid ? (
        <div>
          <h2>Latest Bids</h2>
          {/* <p>{newBid.bidder}</p> */}
          <p className='tw-text-2xl'>
            ${placedBids.length > 0 && parseInt(newBid?.amount ?? '0')}
          </p>
        </div>
      ) : null}

      <p className='tw-text-2xl'>
        Minimum bid:{' '}
        {placedBids.length > 0 &&
        typeof placedBids[lastPlacedBid]?.amount === 'string'
          ? `$${minBid}`
          : null}
      </p>
    </>
  );
}

export default LatestBids;
