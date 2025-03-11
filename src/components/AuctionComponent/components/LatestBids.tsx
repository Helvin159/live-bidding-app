type LatestBidsProps = {
  minBid: number;
};

function LatestBids({ minBid }: LatestBidsProps) {
  return (
    <>
      <div>
        <h2>Minimum bid:</h2>

        <p className='tw-text-2xl'>${minBid + 25} </p>
      </div>
    </>
  );
}

export default LatestBids;
