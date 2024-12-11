import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "@/components/theme/theme-provider"
import "./globals.css";
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <Sidebar />
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                <main className="grid flex-1 items-start gap-4 p-4 ">
                  {children}

                </main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  )
}
