import { Inter } from "next/font/google";
import "../../globals.css";
import Sidebar from "@/components/admin/ui/Sidebar";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <div className="p-4 sm:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
