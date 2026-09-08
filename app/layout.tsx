import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '視覺數學學習 | Visual Math Learning',
  description: '香港小學分數視覺學習 - 粵語旁白 + 繁體中文',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-HK">
      <body>{children}</body>
    </html>
  );
}
