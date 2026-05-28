# ADR 009: Controles de Juego Responsable

**Contexto:** La normativa exige proteger al usuario de comportamientos adictivos.
**Opciones consideradas:**
1. Solo mostrar mensajes de advertencia.
2. Implementar límites duros en base de datos (diario, semanal, mensual) y autoexclusión.
**Decisión:** Opción 2. Se implementaron bloqueos en la capa de middleware/servicios. Subir un límite tiene un cooldown de 24 horas; bajarlo es inmediato.
**Consecuencias:** Cumplimiento estricto de la ley. Mayor carga computacional al verificar límites antes de cada transacción.
**Fecha y autor:** 2026-05, Equipo FairBet.