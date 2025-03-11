import mongoose from 'mongoose';

export type AuctionsType = {
  _id: string;
  auction_id: string;
  lead_name: string;
};

const schema = new mongoose.Schema({
  auction_id: String,
  lead_name: String,
  _id: String
});

const Auctions = mongoose.models.Auctions || mongoose.model('Auctions', schema);

export default Auctions;
