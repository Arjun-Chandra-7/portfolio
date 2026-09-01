import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Webflow Developer — Nenad Popadic | NESH®",
  description: "Webflow developer with 7 years of experience delivering custom builds, CMS setups, GSAP animations, and technical SEO for biotech, SaaS, and blockchain brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-wf-domain="heynesh.com" data-wf-page="691d7ca014d0280ebe2d4114" data-wf-site="691d7c9f14d0280ebe2d4108">
      <head>
        <link href="https://cdn.prod.website-files.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/css/nesh-staging.webflow.shared.bea9f6170.min.css" rel="stylesheet" type="text/css" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link href="https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/69839f2955d4ddfd746742eb_favicon.png" rel="shortcut icon" type="image/x-icon" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0);`
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
