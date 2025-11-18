import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | Sysly',
    default: 'Sysly - System Management Platform',
  },
  description: 'Manage your internal systems and user assignments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
