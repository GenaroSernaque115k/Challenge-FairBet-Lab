import { Outlet } from 'react-router-dom'
import AppBar from '../components/layout/AppBar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-black">
      <AppBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
