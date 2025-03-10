import React from 'react';
import AuctionComponent from '../../components/AuctionComponent/AuctionComponent';
// import getAllBidsInRoom from '../../server-utils/getAllBidsInRoom';

const Bidding = async () => {
  // const ids = await getAllBidsInRoom();

  // console.log(ids);
  return (
    <>
      <div>
        <h1>Welcome to the Auction</h1>
      </div>
      <AuctionComponent />
    </>
  );
};

export default Bidding;
