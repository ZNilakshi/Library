import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'; // Adjust the path based on your project structure
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E Library",
  description: " Its ZNilakshie's E Library",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  const session = await getServerSession();

  return ( 
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}> 
          <Navbar /> {/* Move Navbar inside SessionProvider */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
