'use server';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { parse } from 'url';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 *
 *  @see{@link https://github.com/vercel/next.js/tree/canary/examples/custom-server}
 *  @see{@link https://nextjs.org/docs/app/building-your-application/configuring/custom-server}
 */
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinAuction', (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);
    });

    socket.on('placeBid', (data) => {
      const { auctionId, bid } = data;
      console.log('placed bid', auctionId, bid);
      socket.to(auctionId).emit('newBid', bid);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    server.on('error', (error) => {
      console.error('Error', error);
    });
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
