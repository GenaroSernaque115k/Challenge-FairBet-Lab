import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { EventItem } from '../../services/events'
import EventCard from './EventCard'

interface FeaturedCarouselProps {
  events: EventItem[]
  onSelectOdds: (selectionId: number, odds: string, name: string, event: EventItem) => void
  selectedIds: Set<number>
  onViewDetail?: (eventId: number) => void
}

export default function FeaturedCarousel({ events, onSelectOdds, selectedIds, onViewDetail }: FeaturedCarouselProps) {
  const [offset, setOffset] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const visibleCount = Math.min(4, events.length)

  const advance = useCallback(() => {
    setAnimKey((k) => k + 1)
    setOffset((prev) => (prev + 1) % events.length)
  }, [events.length])

  const rewind = useCallback(() => {
    setAnimKey((k) => k + 1)
    setOffset((prev) => (prev - 1 + events.length) % events.length)
  }, [events.length])

  useEffect(() => {
    if (events.length <= visibleCount) return
    const timer = setInterval(advance, 3000)
    return () => clearInterval(timer)
  }, [advance, events.length, visibleCount])

  if (events.length === 0) return null

  const visible: EventItem[] = []
  for (let i = 0; i < visibleCount; i++) {
    visible.push(events[(offset + i) % events.length])
  }

  return (
    <div className="relative">
      {events.length > visibleCount && (
        <button
          onClick={rewind}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] border border-gray-700 rounded-full p-1.5 hover:bg-[#252525] transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div key={animKey} className="flex gap-4 animate-carousel-fade">
        {visible.map((ev, idx) => (
          <div key={`${animKey}-${ev.id}-${idx}`} className="flex-1">
            <EventCard event={ev} onSelect={onSelectOdds} selectedIds={selectedIds} featured onViewDetail={onViewDetail} />
          </div>
        ))}
      </div>

      {events.length > visibleCount && (
        <button
          onClick={advance}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] border border-gray-700 rounded-full p-1.5 hover:bg-[#252525] transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    <p className="text-[9px] text-gray-600 mt-2 text-center">
      Juega con responsabilidad. El juego en exceso puede causar adicción.
    </p>
    </div>
  )
}
