import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 默认 locale 不在 URL 中显示前缀（即 /en → /）
  localePrefix: 'as-needed',
});
