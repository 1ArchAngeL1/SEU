import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18n(request);

  // The remote runs behind an IIS reverse proxy that forwards to this app on
  // port 3000 but does NOT strip that port out of redirect responses. So any
  // redirect we issue (e.g. locale handling) leaks `...:3000/...` to the
  // browser and sends visitors to a broken URL. Since we can't change IIS,
  // we sanitise the Location header here: drop the internal port and force
  // https on the public host. Localhost is left untouched so dev still works.
  const location = response.headers.get('location');
  if (location) {
    try {
      const url = new URL(location, request.url);
      const isLocal =
        url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if (!isLocal && (url.port || url.protocol === 'http:')) {
        url.port = '';
        url.protocol = 'https:';
        response.headers.set('location', url.toString());
      }
    } catch {
      // Unparseable Location — leave it as-is.
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|common|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|mp4|css|js)$).*)',
  ],
};
