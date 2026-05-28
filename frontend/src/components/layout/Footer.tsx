export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/ISOLOGO.png" alt="FairBet" className="h-6 w-auto opacity-60" />
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="/about" className="hover:text-gray-400 transition">Acerca de</a>
            <a href="/help" className="hover:text-gray-400 transition">Ayuda</a>
            <a href="/profile" className="hover:text-gray-400 transition">Juego Responsable</a>
            <a href="#" className="hover:text-gray-400 transition">Privacidad</a>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800/50 text-center">
          <p className="text-[10px] text-gray-700">
            Plataforma educativa con moneda virtual. No constituye una casa de apuestas.
          </p>
          <p className="text-[10px] text-gray-700 mt-1">
            &copy; 2026 FairBet Lab. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
