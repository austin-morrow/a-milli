// app/(main)/layout.js
import Header from '@/app/components/Header'

export default function MainLayout({ children }) {
  return <Header>{children}</Header>
}