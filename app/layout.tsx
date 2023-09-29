import './globals.css'
import { Montserrat } from 'next/font/google'
import { NextAuthProvider } from '@/providers/authProvider'
import SideNavBar from '@/components/sideNavBar'
import { Toaster } from 'react-hot-toast'

const monts = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Shopco Admin',
  description: 'Manage Shopco Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={`${monts.className} bg-white w-full`}>
          <Toaster />
          <SideNavBar />
          <div className='flex h-full ml-52'>
            <div className='mb-3 mx-3 p-6 w-full'>
              {children}
            </div>
          </div>
        </body>
      </NextAuthProvider>
    </html>
  )
}
