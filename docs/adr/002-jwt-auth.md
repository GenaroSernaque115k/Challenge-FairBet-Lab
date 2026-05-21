# ADR #2: JWT para Autenticación

## Contexto
Se necesita un mecanismo de autenticación stateless para la API.

## Decisión
Usar djangorestframework-simplejwt para tokens JWT.

## Consecuencias
- Tokens con expiración configurable
- Refresh tokens para renovar sesión
- Sin necesidad de sesiones en servidor
