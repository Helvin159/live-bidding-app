// import { MongoClient } from 'mongodb';
// import { NextRequest, NextResponse } from 'next/server';

// const mongoClient = new MongoClient(
//   process.env.MONGODB_URI ?? 'mongodb://localhost:27017/bidding-app'
// );

// async function getAuctionId() {
//   await mongoClient.connect();
//   return 'connected to mongo';
// }

// export async function GET(req: NextRequest) {
//   const a = await getAuctionId();

//   console.log(a, req.url);

//   return NextResponse.json({ message: 'testing' }, { status: 200 });
// }
