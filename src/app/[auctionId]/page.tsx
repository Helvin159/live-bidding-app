import AuctionComponent from '@/components/AuctionComponent/AuctionComponent';

const Bidding = async ({
  params
}: {
  params: Promise<{ auctionId: string }>;
}) => {
  const { auctionId } = await params;

  return (
    <>
      <AuctionComponent auctionId={auctionId} />
    </>
  );
};

export default Bidding;
