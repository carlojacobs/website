import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { SITE_TITLE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      {/* Put padding here so EVERY page has it no matter what it renders */}
      <body className="min-h-screen">
        <RootProvider>
          <main className="mx-auto w-full max-w-[46rem] px-4 sm:px-6 py-8">
            {children}
            <footer className="mt-16 border-t border-black/20 pt-5 text-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-3 uppercase tracking-[0.18em] opacity-60">
                <span>Correspondence</span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 text-sm opacity-80">
                <span>Amsterdam</span>
                <a className="underline underline-offset-4" href="mailto:c.r.m.jacobs@students.uu.nl">
                  c.r.m.jacobs@students.uu.nl
                </a>
                <span>All rights reserved for this content.</span>
              </div>
              <p className="mt-2 text-sm opacity-70">
                The author declares no conflict of interest.
              </p>
            </footer>
          </main>
        </RootProvider>
      </body>
    </html>
  );
}
