import { useEffect, useState } from 'react'
import { events as eventsService, type EventItem } from '../../services/events'
import FeaturedCarousel from '../events/FeaturedCarousel'
import EventCard from '../events/EventCard'

interface CenterContentProps {
  sport: string | null
  searchQuery: string
  onSelectOdds: (selectionId: number, odds: string, name: string, event: EventItem) => void
  selectedIds: Set<number>
  isLive?: boolean
  onViewDetail?: (eventId: number) => void
}

export default function CenterContent({ sport, searchQuery, onSelectOdds, selectedIds, isLive, onViewDetail }: CenterContentProps) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [liveEvents, setLiveEvents] = useState<EventItem[]>([])
  const [featured, setFeatured] = useState<EventItem[]>([])
  const [todayEvents, setTodayEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    if (isLive) {
      eventsService.live().then((evs) => {
        setEvents(evs)
        setLiveEvents(evs)
        setFeatured(evs.filter((e) => e.market_count > 2).slice(0, 8))
        setLoading(false)
      })
      return
    }

    const params = sport ? { sport } : undefined
    eventsService.list(params).then((evs) => {
      setEvents(evs)
      setFeatured(evs.filter((e) => e.market_count > 2).slice(0, 8))
      const today = new Date().toDateString()
      setTodayEvents(evs.filter((e) => new Date(e.start_time).toDateString() === today))
      setLiveEvents(evs.filter((e) => e.status === 'en_vivo').slice(0, 4))
      setLoading(false)
    })
  }, [sport, isLive])

  const filtered = searchQuery
    ? events.filter((e) =>
        e.team_home.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.team_away.toLowerCase().includes(searchQuery.toLowerCase()))
    : events

  if (loading) {
    return <p className="text-gray-500 text-sm py-10 text-center">Cargando eventos...</p>
  }

  if (isLive) {
    return (
      <div className="space-y-6">
        {featured.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
              DESTACADOS EN VIVO
            </h2>
            <FeaturedCarousel events={featured} onSelectOdds={onSelectOdds} selectedIds={selectedIds} onViewDetail={onViewDetail} />
          </>
        )}

        <div>
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            EN VIVO AHORA
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {liveEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onSelect={onSelectOdds} selectedIds={selectedIds} onViewDetail={onViewDetail} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {featured.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
            DESTACADOS
          </h2>
          <FeaturedCarousel events={featured} onSelectOdds={onSelectOdds} selectedIds={selectedIds} onViewDetail={onViewDetail} />
        </>
      )}

      {liveEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              EN VIVO
            </h2>
            <a href="/live" className="text-xs text-primary-400 hover:text-primary-300 transition">
              Ver todos &gt;
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {liveEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onSelect={onSelectOdds} selectedIds={selectedIds} compact />
            ))}
          </div>
        </div>
      )}

      {todayEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            PARTIDOS DE HOY
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {todayEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onSelect={onSelectOdds} selectedIds={selectedIds} onViewDetail={onViewDetail} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          {searchQuery ? 'RESULTADOS' : 'TODOS LOS EVENTOS'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} onSelect={onSelectOdds} selectedIds={selectedIds} onViewDetail={onViewDetail} />
          ))}
        </div>
      </div>
    </div>
  )
}
