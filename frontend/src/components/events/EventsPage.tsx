import { useEffect, useState } from 'react'
import { events as eventsService, type EventItem } from '../../services/events'
import EventCard from './EventCard'

interface EventsPageProps {
  onSelect: (selectionId: number, odds: string, name: string, event: EventItem) => void
  selectedIds: Set<number>
}

export default function EventsPage({ onSelect, selectedIds }: EventsPageProps) {
  const [eventList, setEventList] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    eventsService.list(filter ? { status: filter } : undefined)
      .then(setEventList)
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['', 'programado', 'en_vivo', 'finalizado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f ? 'bg-primary-500 text-black' : 'bg-[#1a1a1a] border border-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            {f === '' ? 'Todos' : f === 'programado' ? 'Programados' : f === 'en_vivo' ? 'En Vivo' : 'Finalizados'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando eventos...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventList.map((ev) => (
            <EventCard key={ev.id} event={ev} onSelect={onSelect} selectedIds={selectedIds} />
          ))}
        </div>
      )}
    </div>
  )
}
