import { Roboto } from "next/font/google";
import "../globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactIcons from '@/components/ContactIcons'
import CartProvider from '@/context/CartProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='font-roboto'>
        <CartProvider>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <ContactIcons />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
