import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Bids from '@/models/Bids';

export async function GET() {
  await dbConnect();

  try {
    const res = await Bids.find({});

    return NextResponse.json({ message: JSON.stringify(res) }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
