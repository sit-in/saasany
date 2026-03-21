import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 导出国际化版本的 Link、redirect、useRouter、usePathname
export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing);
