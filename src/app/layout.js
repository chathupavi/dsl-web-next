import {
  Manrope,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default:
      "Deluxe Shoe Laundry | Premium Sneaker Care",
    template:
      "%s | Deluxe Shoe Laundry",
  },

  description:
    "Professional sneaker cleaning, restoration and care in Malabe. Same-day and 1-day sneaker care services available.",

  keywords: [
    "Deluxe Shoe Laundry",
    "shoe cleaning Malabe",
    "sneaker cleaning Malabe",
    "shoe restoration Sri Lanka",
    "sneaker restoration",
    "shoe laundry Sri Lanka",
  ],

  openGraph: {
    title:
      "Deluxe Shoe Laundry | Stay Fresh. Stay Deluxe.",
    description:
      "Professional sneaker cleaning, restoration and care in Malabe.",
    siteName:
      "Deluxe Shoe Laundry",
    type: "website",
    locale: "en_LK",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06254B",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-white font-sans text-[#06254B]">
        {children}
      </body>
    </html>
  );
}