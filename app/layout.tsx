import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IA Assistente Programável",
  description: "Assistente de IA conversacional com personalidade configurável",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const setInitialTheme = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {setInitialTheme}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
