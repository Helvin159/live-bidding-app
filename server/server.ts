'use server';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { parse } from 'url';
import next from 'next';
import {
  NextServerOptions,
  RequestHandler,
  UpgradeHandler
} from 'next/dist/server/next';
import NextNodeServer from 'next/dist/server/next-server';
import { ServerFields } from 'next/dist/server/lib/router-utils/setup-dev-bundler';

type NextWrapperServer = {
  options: NextServerOptions;
  hostname: string | undefined;
  port: number | undefined;
  getRequestHandler(): RequestHandler;
  prepare(serverFields?: ServerFields): Promise<void>;
  setAssetPrefix(assetPrefix: string): void;
  close(): Promise<void>;
  getUpgradeHandler(): UpgradeHandler;
  logError(...args: Parameters<NextNodeServer['logError']>): void;
  render(
    ...args: Parameters<NextNodeServer['render']>
  ): ReturnType<NextNodeServer['render']>;
  renderToHTML(
    ...args: Parameters<NextNodeServer['renderToHTML']>
  ): ReturnType<NextNodeServer['renderToHTML']>;
  renderError(
    ...args: Parameters<NextNodeServer['renderError']>
  ): ReturnType<NextNodeServer['renderError']>;
  renderErrorToHTML(
    ...args: Parameters<NextNodeServer['renderErrorToHTML']>
  ): ReturnType<NextNodeServer['renderErrorToHTML']>;
  render404(
    ...args: Parameters<NextNodeServer['render404']>
  ): ReturnType<NextNodeServer['render404']>;
};

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
