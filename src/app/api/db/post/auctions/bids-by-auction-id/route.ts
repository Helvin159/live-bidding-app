import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/mongoose';
import Bids from '../../../../../../models/Bids';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { auctionId } = await req.json();
    console.log(auctionId, 'auction ID **********************');
    const res = await Bids.find({ auction_id: auctionId });

    return NextResponse.json({ message: JSON.stringify(res) }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
