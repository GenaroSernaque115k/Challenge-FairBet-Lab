# ADR 008: Máquina de Estados de Apuestas y Re-cotización

**Contexto:** Una apuesta no es simplemente "activa" o "inactiva". Tiene un ciclo de vida complejo. Además, las cuotas pueden cambiar mientras el usuario confirma.
**Opciones consideradas:** 1. Campos booleanos múltiples (`is_won`, `is_cashed_out`).
2. Una máquina de estados finitos (Pendiente -> Aceptada -> Ganada/Perdida/CashOut).
**Decisión:** Opción 2. Si la cuota cambia en el estado "Pendiente", se exige reconfirmación al usuario (política de re-cotización).
**Consecuencias:** Código más limpio y auditable. Evita estados inválidos (ej. una apuesta ganada y con cash-out a la vez).
**Fecha y autor:** 2026-05, Equipo FairBet.