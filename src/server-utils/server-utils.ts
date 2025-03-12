import Auctions from '../models/Auctions';

export async function createNewAuction({
  name,
  phone,
  email,
  description,
  preApprovedAmt,
  creditScore,
  income,
  assets,
  sellingCurrentHome
}: {
  name: string;
  phone: string;
  email: string;
  description: string;
  preApprovedAmt: number;
  creditScore: number;
  income: number;
  assets: number;
  sellingCurrentHome: boolean;
}) {
  try {
    await Auctions.create({
      lead_name: name,
      phone: phone,
      email: email,
      description: description,
      pre_approved_amt: preApprovedAmt,
      credit_score: creditScore,
      income: income,
      assets: assets,
      selling_current_home: sellingCurrentHome
    });
  } catch (error: unknown) {
    console.error(error);
  }
}
