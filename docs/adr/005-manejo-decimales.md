# ADR 005: Manejo de Decimales y Precisión

**Contexto:** El sistema maneja moneda virtual (BP). Usar tipos `float` estándar genera errores de coma flotante y pérdida de precisión en transacciones financieras.
**Opciones consideradas:** 1. Usar `float` y redondear en el frontend.
2. Usar enteros (guardar en centavos/diezmilésimas).
3. Usar el tipo `Decimal` nativo de Python y PostgreSQL.
**Decisión:** Se eligió usar `Decimal(18,4)` en toda la capa de infraestructura y aplicación.
**Consecuencias:** Garantiza precisión matemática exacta en la liquidación de apuestas y cuadre de cajas. Requiere mayor cuidado al serializar/deserializar en JSON.
**Fecha y autor:** 2026-05, Equipo FairBet.