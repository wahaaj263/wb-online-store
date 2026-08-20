import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "W.B Online Store",
  description: "Pakistan's premier modern marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}