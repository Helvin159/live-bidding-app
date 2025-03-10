'use server';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { parse } from 'url';
import next from 'next';
import { RequestHandler } from 'next/dist/server/next';
import { NextWrapperServer } from './types/types';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const app: NextWrapperServer = next({ dev });
const handle: RequestHandler = app.getRequestHandler();

/**
 *
 *  @see{@link https://github.com/vercel/next.js/tree/canary/examples/custom-server}
 *  @see{@link https://nextjs.org/docs/app/building-your-application/configuring/custom-server}
 */
app.prepare().then(() => {
  // Create server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // const auctionId = getAuctionId();

  // console.log(auctionId);

  // Create new IO Object
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Setup socketIO Config
  socketIOConfiguration(io);

  // Start Server
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    console.error('Error', error);
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});

function socketIOConfiguration(io: Server) {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinAuction', async (auctionId) => {
      try {
        // Join the auction with the auction id
        await socket.join(auctionId);
        console.log(`User joined auction: ${auctionId}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        }
      }
    });

    socket.on('placeBid', async (data) => {
      // Destructure expected data
      const { auctionId, bid } = data;

      // Emit event
      socket.to(auctionId).emit('newBid', data);
      console.log('placed bid', auctionId, bid);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}
