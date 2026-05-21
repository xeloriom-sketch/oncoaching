import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar />
    {/* pt-[76px]: pill nav (44px) + top padding (16px) + gap (16px) */}
    <main className="flex-grow pt-[76px]" id="main-content">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
