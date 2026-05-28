# ADR 007: Tiempo Real con Django Channels

**Contexto:** Las cuotas (odds) en vivo cambian constantemente y el cliente necesita verlas sin recargar la página.
**Opciones consideradas:**
1. Polling HTTP tradicional (cada X segundos).
2. Server-Sent Events (SSE).
3. WebSockets con Django Channels y Redis.
**Decisión:** Se eligió Django Channels.
**Consecuencias:** Permite comunicación bidireccional de baja latencia. Incrementa la complejidad de la infraestructura al requerir Daphne (ASGI) y Redis como channel layer.
**Fecha y autor:** 2026-05, Equipo FairBet.