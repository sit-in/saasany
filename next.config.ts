import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  // 指向 request.ts（next-intl 4.x 默认路径为 ./src/i18n/request.ts）
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
