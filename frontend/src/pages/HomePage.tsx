export default function HomePage() {
  return (
    <div className="text-center py-20">
      <img src="/LOGO.PNG" alt="FairBet" className="h-16 mx-auto mb-8" />
      <h1 className="text-4xl font-bold mb-4">
        <span className="text-primary-500">Fair</span>Bet
      </h1>
      <p className="text-xl text-gray-400 mb-2">
        ANALIZAMOS. PROBAMOS. GANAMOS.
      </p>
      <p className="text-gray-500 mb-8">
        Estadisticas, modelos y ciencia para apostar con ventaja.
      </p>
      <button className="bg-primary-600 hover:bg-primary-700 text-black font-semibold px-6 py-3 rounded-lg transition">
        Conoce nuestro metodo
      </button>
    </div>
  )
}
