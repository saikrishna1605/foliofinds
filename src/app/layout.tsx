import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { CartProvider } from '@/components/cart-provider';
import Script from 'next/script';
import { Chatbot } from '@/components/chatbot';

export const metadata: Metadata = {
  title: 'FolioFinds',
  description: 'Buy and sell used books with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <div className="relative flex min-h-dvh flex-col bg-background">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </div>
                <Toaster />
                <Chatbot />
              </CartProvider>
            </AuthProvider>
        </ThemeProvider>
        <Script
            id="tawk-to-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
                    var Tawk_API=Tawk_API||{};
                    Tawk_API.onLoad = function(){
                        Tawk_API.hideWidget();
                    };
                    var Tawk_LoadStart=new Date();
                    (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                    })();
                `,
            }}
        />
      </body>
    </html>
  );
}
