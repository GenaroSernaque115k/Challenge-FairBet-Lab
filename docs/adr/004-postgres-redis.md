# ADR #4: PostgreSQL + Redis como Infraestructura

## Contexto
Se necesita una base de datos relacional robusta y un sistema de cache/broker para tareas asíncronas.

## Decisión
Usar PostgreSQL 16 como base de datos principal y Redis 7 para cache y broker de Celery.

## Consecuencias
- ACID para transacciones financieras
- Redis para WebSocket channel layer y Celery
- Escalabilidad horizontal posible
