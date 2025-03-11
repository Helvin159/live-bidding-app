import { IBids } from '../../../models/Bids';

function CurrentBids({ placedBids }: { placedBids: IBids[] | [] }) {
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

export default CurrentBids;
