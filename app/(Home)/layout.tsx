import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Generated by create next app',
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <div className={`antialiased max-w-7xl mx-auto px-4`}>{children}</div>
    </main>
  )
}
