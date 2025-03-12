import "../globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactIcons from '@/components/ContactIcons'
import CartProvider from '@/context/CartProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <meta name="robots" content="index,follow" />
      <meta name="google-site-verification" content="bnj-0vSnMlKuLmNzj5kleHIQ2Sk85O1ZqwB4-fGPIHo" />
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
