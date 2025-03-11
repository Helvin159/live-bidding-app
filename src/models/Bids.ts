import mongoose, { Schema, Document } from 'mongoose';

export interface IBids extends Document {
  name: string | undefined;
  amount: number;
  auction_id: string;
  timestamp: Date;
}

const BidsSchema = new Schema({
  auction_id: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date }
});

const Bids = mongoose.models.Bids || mongoose.model('Bids', BidsSchema, 'bids');

export default Bids;
