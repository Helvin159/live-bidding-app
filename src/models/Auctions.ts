import mongoose from 'mongoose';

export type AuctionsType = {
  id: string;
  lead_name: string;
  phone: string;
  email: string;
  description: string;
  pre_approved_amt: number;
  credit_score: number;
  income: number;
  assets: number;
  selling_current_home: boolean;
};

const schema = new mongoose.Schema({
  lead_name: String,
  phone: String,
  email: String,
  description: String,
  pre_approved_amt: Number,
  credit_score: Number,
  income: Number,
  assets: Number,
  selling_current_home: Boolean
});

const Auctions =
  mongoose.models?.Auctions || mongoose.model('Auctions', schema);

export default Auctions;
