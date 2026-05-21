# ADR #3: Partida Doble para Wallet

## Contexto
Se necesita un sistema de billetera con trazabilidad completa de transacciones.

## Decisión
Implementar sistema de partida doble con LedgerEntry.

## Consecuencias
- Cada transacción queda registrada
- Balance calculado como suma de entradas
- Auditoría completa de movimientos
