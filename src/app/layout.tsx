import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";


export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Xyroots — Where Great Teachers Meet Great Schools",
  description:
    "Xyroots is the modern teacher recruitment marketplace connecting talented educators with schools and institutions. Find teaching jobs, hire qualified teachers, and build better faculties.",
  keywords: [
    "teacher jobs",
    "teaching recruitment",
    "school hiring",
    "education jobs India",
    "teacher marketplace",
    "CBSE teacher jobs",
    "ICSE teacher jobs",
    "Kerala teacher jobs",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Xyroots — Where Great Teachers Meet Great Schools",
    description:
      "The modern platform where teachers find jobs and schools find teachers.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Xyroots — Where Great Teachers Meet Great Schools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xyroots — Where Great Teachers Meet Great Schools",
    description: "The modern platform where teachers find jobs and schools find teachers.",
    images: ["/opengraph-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800,900&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" 
          rel="stylesheet" 
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
      </head>
      <body className={`font-sans antialiased page-bg`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
