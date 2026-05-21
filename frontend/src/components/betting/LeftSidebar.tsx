import { useEffect, useState } from 'react'
import { Search, ChevronRight, Star } from 'lucide-react'
import { events as eventsService, type Sport } from '../../services/events'

interface LeftSidebarProps {
  onSelectSport: (slug: string | null) => void
  onSelectEvent: (eventId: number) => void
  selectedSport: string | null
  searchQuery: string
  onSearchChange: (q: string) => void
}

const SPORT_ICONS: Record<string, string> = {
  football: '⚽', tennis: '🎾', basketball: '🏀', volleyball: '🏐',
}

export default function LeftSidebar({
  onSelectSport, onSelectEvent, selectedSport, searchQuery, onSearchChange,
}: LeftSidebarProps) {
  const [sports, setSports] = useState<Sport[]>([])
  const [todayEvents, setTodayEvents] = useState<{ id: number; home: string; away: string }[]>([])

  useEffect(() => {
    eventsService.sports().then(setSports)
    eventsService.list({ status: 'programado' }).then((evs) => {
      const today = new Date().toDateString()
      const filtered = evs.filter((e) => new Date(e.start_time).toDateString() === today)
      setTodayEvents(filtered.map((e) => ({ id: e.id, home: e.team_home, away: e.team_away })).slice(0, 10))
    })
  }, [])

  return (
    <aside className="w-64 flex-shrink-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
          Deportes
        </h3>
        {sports.map((sp) => (
          <button
            key={sp.slug}
            onClick={() => onSelectSport(selectedSport === sp.slug ? null : sp.slug)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              selectedSport === sp.slug
                ? 'bg-primary-500/10 text-primary-400 font-medium'
                : 'text-gray-300 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>{SPORT_ICONS[sp.slug] || '🏆'}</span>
            <span>{sp.name}</span>
            <span className="ml-auto text-xs text-gray-600">
              {selectedSport === sp.slug ? null : <ChevronRight className="w-3 h-3" />}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
          LIGAS PRINCIPALES
        </h3>
        {['Champions League', 'La Liga', 'Premier League', 'Serie A', 'Liga 1 Peru'].map((l) => (
          <button key={l} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">
            <Star className="w-3 h-3 text-yellow-600" />
            {l}
          </button>
        ))}
      </div>

      {todayEvents.length > 0 && (
        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
            HOY
          </h3>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {todayEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => onSelectEvent(ev.id)}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-[#1a1a1a] rounded-lg transition truncate"
              >
                {ev.home} vs {ev.away}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-800 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar equipo..."
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 placeholder-gray-600"
          />
        </div>
      </div>
    </aside>
  )
}
