import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 匹配根路径
    '/',
    // 匹配所有路径，但排除 Next.js 内部路由、静态资源和 API 路由
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
