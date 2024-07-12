import { Open_Sans } from "next/font/google";
import "../globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactIcons from '@/components/ContactIcons'
import CartProvider from '@/context/CartProvider'

const open_sans = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} `}>
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
