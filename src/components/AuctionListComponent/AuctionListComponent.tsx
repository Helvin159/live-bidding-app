import { AuctionsType } from '@/models/Auctions';
import Link from 'next/link';

const AuctionListComponent = ({ auctions }: { auctions: AuctionsType[] }) => {
  return (
    <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
      {auctions &&
        auctions.map((i: AuctionsType, k: number) => (
          <div key={k} className='tw-p-4'>
            <Link href={`/${i._id}`}>{i.lead_name}</Link>
          </div>
        ))}
    </div>
  );
};

export default AuctionListComponent;
