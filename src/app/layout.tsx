import * as React from 'react';
import './globals.css'
import { Inter } from 'next/font/google'
import Template from './components/template';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Autoware Admin Console',
  description: 'Admin console for Autoware',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Template children={children}/>
      </body>
    </html>
  )
}
