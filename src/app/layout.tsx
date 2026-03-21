// 根 layout 保持最小化，只提供 html 骨架。
// 字体、metadata、Provider 等由 [locale]/layout.tsx 处理。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
