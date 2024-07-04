import { Inter } from "next/font/google";
import "../globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactIcons from '@/components/ContactIcons'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <ContactIcons />
        <Footer />
      </body>
    </html>
  );
}
