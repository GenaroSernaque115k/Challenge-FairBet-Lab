import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { EventItem } from '../services/events'
import LeftSidebar from '../components/betting/LeftSidebar'
import CenterContent from '../components/betting/CenterContent'
import SportDetailView from '../components/betting/SportDetailView'
import EventDetailView from '../components/betting/EventDetailView'
import BetSlip from '../components/betting/BetSlip'
import ActiveBets from '../components/betting/ActiveBets'

interface Selection {
  selectionId: number
  odds: string
  name: string
  eventHome: string
  eventAway: string
}

export default function BettingPage() {
  const location = useLocation()
  const isLive = location.pathname === '/live'
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selections, setSelections] = useState<Selection[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [rightTab, setRightTab] = useState<'cupon' | 'apuestas'>('cupon')
  const selectedIds = useMemo(() => new Set(selections.map((s) => s.selectionId)), [selections])

  useEffect(() => {
    if (selectedSport) {
      setSelectedEventId(null)
    }
  }, [selectedSport])

  const handleSelectOdds = (selectionId: number, odds: string, name: string, event: EventItem | any) => {
    if (!odds || odds === '0') return
    setSelections((prev) => {
      if (prev.find((s) => s.selectionId === selectionId)) {
        return prev.filter((s) => s.selectionId !== selectionId)
      }
      return [...prev, {
        selectionId,
        odds,
        name,
        eventHome: event.team_home || event.teamHome,
        eventAway: event.team_away || event.teamAway,
      }]
    })
    setRightTab('cupon')
  }

  const handleRemove = (id: number) => setSelections((prev) => prev.filter((s) => s.selectionId !== id))

  const renderCenter = () => {
    if (selectedEventId) {
      return (
        <EventDetailView
          eventId={selectedEventId}
          onBack={() => setSelectedEventId(null)}
          onSelect={handleSelectOdds}
          selectedIds={selectedIds}
        />
      )
    }

    if (selectedSport) {
      return (
        <SportDetailView
          sportSlug={selectedSport}
          sportName={selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}
          onBack={() => setSelectedSport(null)}
          onSelect={handleSelectOdds}
          selectedIds={selectedIds}
          onSelectEvent={(id) => setSelectedEventId(id)}
        />
      )
    }

    return (
      <CenterContent
        sport={isLive ? null : 'football'}
        searchQuery={searchQuery}
        onSelectOdds={handleSelectOdds}
        selectedIds={selectedIds}
        isLive={isLive}
        onViewDetail={(id) => setSelectedEventId(id)}
      />
    )
  }

  return (
    <div className="flex gap-4 px-4">
      <LeftSidebar
        onSelectSport={(slug) => setSelectedSport(slug)}
        onSelectEvent={(id) => setSelectedEventId(id)}
        selectedSport={selectedSport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 min-w-0">
        {renderCenter()}
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl sticky top-20 overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setRightTab('cupon')}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase transition border-b-2 -mb-[1px] ${
                rightTab === 'cupon'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Cupón{selections.length > 0 ? ` (${selections.length})` : ''}
            </button>
            <button
              onClick={() => setRightTab('apuestas')}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase transition border-b-2 -mb-[1px] ${
                rightTab === 'apuestas'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Mis Apuestas
            </button>
          </div>
          <div className="p-5">
            {rightTab === 'cupon' ? (
              <BetSlip
                selections={selections}
                onRemove={handleRemove}
                onClear={() => setSelections([])}
                onBetPlaced={() => { setSelections([]); setRightTab('apuestas') }}
              />
            ) : (
              <ActiveBets />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
