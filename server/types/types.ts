import { ServerFields } from 'next/dist/server/lib/router-utils/setup-dev-bundler';
import {
  NextServerOptions,
  RequestHandler,
  UpgradeHandler
} from 'next/dist/server/next';
import NextNodeServer from 'next/dist/server/next-server';

export type NextWrapperServer = {
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
