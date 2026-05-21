import { useEffect, useRef, useState, useCallback } from 'react'

interface OddsData {
  type: string
  event_id: number
  status: string
  markets: Array<{
    id: number
    type: string
    name: string
    selections: Array<{ id: number; name: string; odds: string }>
  }>
}

export function useEventOdds(eventId: number | null) {
  const [data, setData] = useState<OddsData | null>(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!eventId || wsRef.current) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const ws = new WebSocket(`${protocol}//${host}/ws/events/${eventId}/`)

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'recotizacion') {
          setData((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              markets: prev.markets.map((m) => ({
                ...m,
                selections: m.selections.map((s) =>
                  s.id === msg.selection_id ? { ...s, odds: msg.new_odds } : s
                ),
              })),
            }
          })
        } else if (msg.type === 'odds_data') {
          setData(msg)
        }
      } catch {}
    }

    wsRef.current = ws
  }, [eventId])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
    setData(null)
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { data, connected }
}
