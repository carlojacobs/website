import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      {/* Put padding here so EVERY page has it no matter what it renders */}
      <body className="min-h-screen">
        <RootProvider>
          <main className="mx-auto w-full max-w-[46rem] px-4 sm:px-6 py-8">
            {children}
          </main>
        </RootProvider>
      </body>
    </html>
  );
}
