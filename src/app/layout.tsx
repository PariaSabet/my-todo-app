import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'A minimal todo list application',
  icons: {
    icon: [
      { url: '/list.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/list.svg'],
    apple: [
      { url: '/list.svg', type: 'image/svg+xml' }
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
