import { mongoose as Mongoose } from 'mongoose';

declare global {
  // const mongoose: {
  //   conn: typeof Mongoose | null;
  //   promise: Promise<typeof Mongoose> | null;
  // };
  namespace NodeJS {
    interface Global {
      mongoose: typeof Mongoose;
    }
  }
}
