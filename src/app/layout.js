import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/context/AuthContext";
import { CartProvider } from "../components/context/CartContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Arthakara",
  description: "E-Commerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        
        {/* Midtrans Snap Script */}
        <Script 
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key="Mid-client-KYxr2VdaVh6YqT3o"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}