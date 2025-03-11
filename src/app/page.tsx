import Auctions from '@/models/Auctions';
import AuctionListComponent from '@/components/AuctionListComponent/AuctionListComponent';
import dbConnect from '@/lib/mongoose';

export default async function Home() {
  await dbConnect();
  const auctions = await Auctions.find({});

  return (
    <>
      <section className='tw-max-w-3xl tw-mx-auto tw-text-center'>
        <h1 className='tw-text-3xl'>Bidding app practice</h1>
      </section>

      <section className='tw-max-w-3xl tw-mx-auto'>
        <AuctionListComponent auctions={auctions} />
      </section>
    </>
  );
}
