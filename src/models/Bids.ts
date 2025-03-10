import { Schema, models, model, Document, Model } from 'mongoose';

export interface IBids extends Document {
  name: string | undefined;
  amount: number;
  auction_id: string;
  timestamp: Date;
}

const BidSchema = new Schema({
  auction_id: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date }
});

const Bids: Model<IBids> = models.Bid || model<IBids>('Bid', BidSchema, 'bids');

export default Bids;
