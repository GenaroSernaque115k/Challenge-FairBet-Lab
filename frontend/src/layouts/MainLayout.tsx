import { Outlet } from 'react-router-dom'
import AppBar from '../components/layout/AppBar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AppBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
