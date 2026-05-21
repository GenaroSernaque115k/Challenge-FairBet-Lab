import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import BettingPage from './pages/BettingPage'
import MyBetsPage from './pages/MyBetsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/betting" element={<BettingPage />} />
          <Route path="/my-bets" element={<MyBetsPage />} />
          <Route path="/live" element={<BettingPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
