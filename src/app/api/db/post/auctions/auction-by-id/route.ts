import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/mongoose';
import Auctions from '../../../../../../models/Auctions';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { auctionId } = await req.json();
    const res = await Auctions.find({});
    const targetAuction = res.find(({ id }) => id === auctionId);

    return NextResponse.json(
      { message: JSON.stringify(targetAuction) },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
