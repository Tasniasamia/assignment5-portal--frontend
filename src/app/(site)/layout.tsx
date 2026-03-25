import React from 'react';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer/>
      </div>
  );
}