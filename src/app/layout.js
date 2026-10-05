// app/layout.js
import './globals.css'

export const metadata = {
  title: 'A Milli',
  description: 'Description here',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">{children}</body>
    </html>
  )
}