import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// Landing Page 占位 — 后续会替换为完整设计
export default function HomePage() {
  const t = useTranslations('hero');
  const tNav = useTranslations('nav');

  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-32 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
        {t('subtitle')}
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/80"
        >
          {t('cta')}
        </Link>
        <Link
          href="#demo"
          className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {t('secondaryCta')}
        </Link>
      </div>
      {/* 临时语言切换 — 后续会放入 Nav 组件 */}
      <nav className="mt-16 flex gap-4 text-xs text-muted-foreground">
        <Link href="/" locale="en">{tNav('home')} (EN)</Link>
        <Link href="/" locale="zh">{tNav('home')} (中文)</Link>
      </nav>
    </main>
  );
}
