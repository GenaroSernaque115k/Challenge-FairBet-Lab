# ADR 010: Auditoría Inmutable (Hash SHA-256)

**Contexto:** Requisito de la Ley 31557 para evitar manipulación de bases de datos por parte del operador.
**Opciones consideradas:**
1. Logs simples de texto.
2. Tabla append-only con encadenamiento criptográfico.
**Decisión:** Opción 2. Cada movimiento calcula un hash basado en el payload actual y el hash del registro anterior (`hash_n = SHA256(hash_n-1 + payload_n)`).
**Consecuencias:** Si alguien altera un registro manualmente en la base de datos, la cadena se rompe y el endpoint de verificación lo detecta. Asegura transparencia.
**Fecha y autor:** 2026-05, Equipo FairBet.