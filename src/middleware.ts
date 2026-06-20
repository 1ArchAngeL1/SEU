import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|_next|common|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|mp4|css|js)$).*)',
  ],
};
