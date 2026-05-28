# ADR 006: Estrategia de Concurrencia e Idempotencia

**Contexto:** Múltiples peticiones simultáneas (doble clic) podrían generar doble gasto o corrupción de saldo.
**Opciones consideradas:**
1. Bloqueo optimista (versionado de filas).
2. Bloqueo pesimista con `select_for_update` + Llaves de Idempotencia.
**Decisión:** Se optó por la opción 2. Toda transacción de wallet usa `select_for_update` dentro de un bloque `transaction.atomic`.
**Consecuencias:** Previene absolutamente el doble gasto. Puede generar cuellos de botella temporales si un mismo usuario hace múltiples requests en milisegundos, lo cual es aceptable.
**Fecha y autor:** 2026-05, Equipo FairBet.