import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast-context';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const metadata: Metadata = {
  title: 'LedgerAI — Personal Finance & Anomaly Intelligence',
  description: 'AI-native B2C Personal Finance Analyzer, transaction categorizer, and spending anomaly engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <ToastProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}

