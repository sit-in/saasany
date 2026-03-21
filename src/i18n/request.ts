import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale 在 next-intl 4.x 是 Promise<string | undefined>
  let locale = await requestLocale;

  // 若 locale 无效则回退到默认值
  if (!locale || !routing.locales.includes(locale as 'en' | 'zh')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
