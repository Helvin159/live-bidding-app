import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/mongoose';
import Bids from '../../../../../../models/Bids';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();

    await Bids.create({
      name: body.name,
      amount: body.amount,
      auction_id: body.auction_id,
      timestamp: new Date()
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
