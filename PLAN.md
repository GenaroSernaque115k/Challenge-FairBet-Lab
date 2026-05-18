# FairBet - Plan de Desarrollo (5 Fases, 5 Desarrolladores) ✅ COMPLETADO

## Estructura del Proyecto

```
PaginaApuestas/
├── backend/                    # Django REST API (Clean Architecture)
│   ├── controllers/            # HTTP handlers
│   ├── application/            # Use cases + DTOs
│   ├── domain/                 # Entities, value objects, interfaces
│   ├── infrastructure/         # Models, repos, mappers
│   ├── users/                  # Auth, perfiles
│   ├── wallet/                 # Billetera, partida doble
│   ├── events/                 # Eventos, WebSocket consumers
│   ├── betting/                # Apuestas, combinadas, cash-out
│   ├── responsible_gaming/     # Limites, autoexclusion
│   ├── audit/                  # Log encadenado, integridad
│   ├── bonuses/                # Bonos, rollover
│   ├── operator/               # Dashboard, metricas, reportes
│   ├── fairbet/                # Settings, urls, asgi
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   # React + Vite + TypeScript
│   ├── public/                 # LOGO.PNG, ISOLOGO.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # AppBar (barra superior negra)
│   │   │   ├── auth/           # LoginModal, RegisterModal (popups)
│   │   │   ├── user/           # UserPanel (panel deslizable derecho)
│   │   │   └── wallet/         # DepositModal, WithdrawModal (popups)
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # HomePage (landing)
│   │   ├── routes/             # ProtectedRoute
│   │   ├── services/           # API calls (axios) - api.ts, auth.ts
│   │   ├── store/              # Zustand - balanceStore.ts
│   │   ├── types/              # TypeScript interfaces
│   │   ├── context/            # AuthContext (login, register, logout, user state)
│   │   ├── utils/              # cn(), formatBalance()
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── docs/
│   └── adr/
└── README.md
```

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|------------|
| Backend | Django 5 + DRF + Channels + Celery |
| Frontend | React 18 + Vite + TypeScript |
| UI | TailwindCSS |
| State | React Query (server) + Zustand (client) |
| DB | PostgreSQL 16 |
| Cache/Broker | Redis 7 |
| Auth | JWT (simplejwt) |
| Docs | drf-spectacular (OpenAPI 3.0) |
| Logs | python-json-logger |

---

## Diseño de Referencia - UI Principal

### Layout General (Desktop)

```
+----------------------------------------------------------------------------------------------------+
|  [F] FairBet Lab    Apuesta Deportiva   Apuestas en Vivo   Acerca de Nosotros   Ayuda              |
|                                                                          [ Iniciar sesion ] [Ingresar] |
+----------------------------------------------------------------------------------------------------+
| DESTACADOS          |                                                                              | BOLETO DE APUESTA          [*] |
| [*] Partidos de Hoy |  ============================================================================| +---------------------------------+ |
| (()) En Vivo        | |  ANALIZAMOS. PROBAMOS. GANAMOS.                                           | | | SIMPLE  |  COMBINADA  |  SISTEMA  | |
| [ ] Proximos        | |  Estadisticas, modelos y ciencia para apostar con ventaja.                | | +---------------------------------+ |
| [ ] Mis Favoritos   | |                                                                           | | Manchester City            1.65 [X]| |
|                     | |  [ Conoce nuestro metodo ]                                                | | Resultado Final                   | |
| DEPORTES            |  ============================================================================| Man. City vs Real Madrid          | |
| (o) Futbol     1284 |                                                                              |                                   | |
| ( ) Tenis       342 |  (•) EN VIVO AHORA                                              Ver todos >  | Importe de apuesta:  [  100.00  ] BP| |
| ( ) Basketball  218 | +--------------------------------------------------------------------------+| [ +10 ] [ +50 ] [ +100 ] [ MAX ]  | |
|                     | | EVENTO              |   1   |   X   |   2   |  MAS DE  |  MENOS DE  |    | |                                   | |
| LIGAS PRINCIPALES   | |---------------------+-------+-------+-------+----------+------------+----| | Ganancia posible:        165.00 BP| |
| (*) Champions League| | Man. City (1)       |  1.65 |  3.80 |  5.50 | 1.85 2.5 |  1.95 2.5  |+128>| +---------------------------------+ |
| (*) LaLiga          | | Real Madrid (0)     |       |       |       |          |            |    | | Juego responsable                 | |
| (*) Premier League  | +--------------------------------------------------------------------------+| | El juego con exceso puede       | |
|                     |                                                                              | | causar adiccion. Juega con      | |
|                     |  PROXIMOS PARTIDOS DESTACADOS                                   Ver cal. >   | | responsabilidad.                | |
|                     | +--------------------------------------------------------------------------+| +---------------------------------+ |
|                     | | HORARIO   | EVENTO                        |   1   |   X   |   2   |      | | [        Realizar apuesta       ] | |
|                     | |-----------+-------------------------------+-------+-------+-------+------| +---------------------------------+ |
|                     | | Hoy 21:00 | Inter de Milan vs AC Milan    |  1.72 |  3.70 |  4.80 |  [*] |                                     |
|                     | | Hoy 21:00 | Atletico Madrid vs Sevilla    |  1.80 |  3.50 |  4.40 |  [*] | PROMOCIONES           Ver todas >    |
|                     | +--------------------------------------------------------------------------+| +---------------------------------+ |
|                     |                                                                              | | BONO DE BIENVENIDA              | |
|                     |                                                                              | | 100% HASTA 100 BP               | |
|                     |                                                                              | | [ Reclamar ahora ]              | |
|                     |                                                                              | +---------------------------------+ |
+----------------------------------------------------------------------------------------------------+
|  Plataforma educativa con moneda virtual. No constituye una casa de apuestas.                      |
+----------------------------------------------------------------------------------------------------+
```

### Componentes Clave del Frontend

| Componente | Descripcion | Fase |
|------------|-------------|------|
| Header | Logo, nav, saldo, login/register | 1 |
| Sidebar | Deportes, ligas, favoritos, destacados | 2 |
| EventCard | Partido con odds 1X2, O/U, BTTS | 2 |
| LiveBadge | Indicador "EN VIVO" con animacion | 2 |
| BetSlip | Boleto lateral (simple/combinada/sistema) | 2 |
| OddsButton | Boton de seleccion de cuota | 2 |
| BalanceCard | Saldo actual en header/wallet | 1 |
| DepositForm | Formulario de recarga | 1 |
| WithdrawForm | Formulario de retiro | 1 |
| LimitSettings | Configuracion de limites | 3 |
| BonusCard | Card de bonos disponibles | 4 |
| AdminDashboard | Panel metricas, exposure, reportes | 4 |

### Paginas del Frontend por Fase

**Fase 1 (Barreto):**
- LoginPage (AuthLayout)
- RegisterPage (AuthLayout)
- WalletPage: BalanceCard, DepositForm, WithdrawForm
- Header con saldo del usuario
- MainLayout base

**Fase 2 (Sernaque):**
- HomePage con hero, eventos destacados y en vivo
- EventsPage con filtros por deporte/liga
- LiveEventsPage con odds en tiempo real (WebSocket)
- BettingPage con BetSlip lateral
- MyBetsPage con historial de apuestas
- Sidebar con deportes y ligas

**Fase 3 (Inon):**
- ProfilePage con configuracion de limites
- AutoExclusionForm
- Admin: flagged users panel
- Mensaje "consumo responsable" en BetSlip

**Fase 4 (Gines):**
- BonusesPage con cards de bonos disponibles
- AdminDashboard con metricas y graficos
- ReportsPage con descarga CSV
- OperatorMetricsPage

**Fase 5 (Villazon):**
- Integracion completa de todas las paginas
- Responsive design (mobile-first)
- Admin panel completo
- Loading states, error boundaries, toasts
- Navigation, Sidebar colapsable, Footer legal

---

## Fase 1 - Barreto: Infraestructura + Auth + Wallet  ✅ CULMINADA (commit: dc2d89c)

### Backend (Clean Architecture)

**Estructura de capas implementada:**
- `controllers/` → Views HTTP con Swagger @extend_schema
- `application/` → Serializers (DTOs) + lógica de negocio (recargar, retirar, get_balance, create_double_entry, transferir)
- `domain/` → Validadores puros (validate_dni algoritmo verificador peruano)
- `infrastructure/` → Modelos Django ORM (User, UserProfile, IdempotencyKey, Account, LedgerEntry)
- `users/` y `wallet/` → Apps delgadas (re-exports, urls, migrations, apps.py)

**Modelos (alineados al challenge - Fase 1.5):**
- `User(AbstractUser)` — email unique
- `UserProfile` — dni, fecha_nacimiento, estado_cuenta: pendiente_verificacion(default), verificado, bloqueado, autoexcluido
- `IdempotencyKey` — key + user FK + response_data JSON, índice compuesto (key, user)
- `Account` — ForeignKey User (nullable: cuentas sistema sin user), type: main/bonus/casa/apuestas_pendientes, unique_together(user, type)
- `LedgerEntry` — account FK, amount Decimal(18,4), direction DEBIT/CREDIT, transaction_id UUID con índice, ordering por -created_at
- Partida doble real: cada operación crea 2+ entradas balanceadas (DEBIT + CREDIT, SUMA = 0). `select_for_update` + `transaction.atomic`
- Funciones: `get_balance()` = SUM(CREDIT) - SUM(DEBIT), `create_double_entry()`, `recargar()`, `retirar()`, `transferir()`
- `RegisterSerializer.create()` crea User + UserProfile + Account en 1 transacción atómica
- Idempotencia en endpoints wallet: header `X-Idempotency-Key` + modelo `IdempotencyKey`

**Auth:** JWT via simplejwt (access 1h, refresh 7d, rotate), middleware IsAuthenticated default

**Seed:** `manage.py seed_demo` — usuario sistema_casa + cuentas casa/apuestas_pendientes, 2 usuarios demo (verificados): demo1/demo1234 (1000 BP), demo2/demo1234 (500 BP)

**Infraestructura:** Docker Compose 6 servicios: db (PostgreSQL 16), redis (7), backend (Daphne :8000), frontend (Vite :5173), celery-worker, celery-beat

### Frontend (React 18 + Vite + TS + Tailwind)

**Paleta:** Negro (#0a0a0a) + Dorado (#d4af37, #e8c547)

**Layout:**
- `MainLayout` — AppBar (sticky top, bg-black) + contenido + footer
- Sin AuthLayout (auth es popups, no páginas separadas)

**Componentes:**
| Componente | Descripción |
|------------|-------------|
| `AppBar` | Barra negra: LOGO.PNG (h-12), nav (Apuesta Deportiva, En Vivo, Nosotros, Ayuda). Sin sesión: [Ingresar] [Registrarse]. Con sesión: saldo dorado, [+ Depositar], icono usuario |
| `LoginModal` | Popup overlay centrado, fondo blur, bg #1a1a1a, inputs estilizados, link a registro |
| `RegisterModal` | Popup overlay: username, email, password, DNI, fecha_nacimiento, link a login |
| `UserPanel` | Slide-in derecha (animación): saldo, Wallet, Notificaciones, Depositar, Retirar, Mi Perfil, Historial, Control, Cerrar Sesión |
| `DepositModal` | Popup recarga: input monto (4 decimales) + botones rápidos (+10, +50, +100, +500), idempotencia automática, botón dorado |
| `WithdrawModal` | Popup retiro: input monto (4 decimales), muestra saldo disponible, validación saldo, idempotencia automática, botón naranja |

**Estado:**
- `AuthContext` — user, loading, login(), register(), logout() con reset de balance
- `useBalanceStore` (Zustand) — balance, setBalance. Reset a 0 en logout/register
- `useEffect` en AppBar y UserPanel sincronizan balance desde API al montar

**Servicios:** Axios con interceptors (Bearer token automático + refresh en 401)

### Swagger (drf-spectacular)

**Documentados con @extend_schema, schemas de request/response y ejemplos:**
- `POST /api/auth/register/` — TokenResponse schema (access + refresh + user), auth=[] (sin candado)
- `POST /api/auth/login/` — LoginSerializer request, TokenResponse response, descripción "usa access no refresh", auth=[]
- `GET /api/auth/me/` — UserSerializer response, JWT requerido
- `POST /api/wallet/recargar/` — RecargarSerializer(18,4) request, idempotencia via X-Idempotency-Key header, partida doble (casa→usuario), ejemplo 100 BP
- `POST /api/wallet/retirar/` — RetirarSerializer(18,4) request, idempotencia via X-Idempotency-Key header, partida doble (usuario→casa), validación saldo suficiente, ejemplo 50 BP
- `GET /api/wallet/saldo/` — response balance = SUM(CREDIT) - SUM(DEBIT), ejemplo 1000 BP

**Config:** `SPECTACULAR_SETTINGS` con descripción instructiva en Swagger UI + Redoc

### Seguridad

- Token `access` (1h) se pega en Swagger Authorize como `Bearer <token>`
- Login y Register no requieren auth (auth=[])
- Rate limiting pendiente (Fase 5)
- Balance se resetea a 0 al cerrar sesión o cambiar de cuenta

### ADRs

- `docs/adr/001-django-drf.md`
- `docs/adr/002-jwt-auth.md`
- `docs/adr/003-double-entry-wallet.md`
- `docs/adr/004-postgres-redis.md`

### Endpoints verificados

| Método | Endpoint | Auth | Notas |
|--------|----------|------|-------|
| POST | `/api/auth/register/` | No | Crea User + UserProfile + Account, retorna JWT |
| POST | `/api/auth/login/` | No | Autentica, retorna access+refresh+user |
| GET | `/api/auth/me/` | JWT | Perfil del usuario autenticado |
| POST | `/api/wallet/recargar/` | JWT | Partida doble (casa→usuario), idempotencia, decimal(18,4) |
| POST | `/api/wallet/retirar/` | JWT | Partida doble (usuario→casa), validación saldo, idempotencia, decimal(18,4) |
| GET | `/api/wallet/saldo/` | JWT | SUM(CREDIT) - SUM(DEBIT) |

### Correcciones aplicadas sobre el diseño original

- Backend reestructurado a Clean Architecture real (controllers/, application/, domain/, infrastructure/ con código, no carpetas vacías)
- LoginView refactorizado para usar LoginSerializer (Swagger muestra campos de input)
- Ejemplos wallet con flag request_only (antes response_only, no se veían en "Try it out")
- Registro crea Account automáticamente (antes solo User + UserProfile → recargar fallaba)
- min_value Decimal en serializers wallet (antes float → warning)
- Frontend migrado de páginas separadas a popups overlay (UX más fluida)
- Paleta verde reemplazada por dorado (identidad FairBet)
- Logo tamaño aumentado 50% (h-8 → h-12)

### Fase 1.5 — Alineación Challenge FairBet Lab  ✅ CULMINADA (commit: 23720a6)

Cambios aplicados para cumplir los requisitos del challenge (Nivel 1 - Núcleo obligatorio):

**Wallet - Partida doble real:**
- `LedgerEntry.direction` (DEBIT/CREDIT) y `transaction_id` (UUID, db_index)
- Cada operación crea 2+ entradas balanceadas: suma DEBIT + CREDIT = 0
- `get_balance()` = `SUM(amount WHERE direction='CREDIT') - SUM(amount WHERE direction='DEBIT')`
- Saldo nunca se almacena, siempre se calcula

**Cuentas del sistema:**
- Nuevos `AccountType`: `casa` (Cuenta Casa), `apuestas_pendientes` (Apuestas Pendientes)
- `Account.user` → ForeignKey nullable (cuentas sistema sin usuario)
- Seed crea usuario `sistema_casa` con cuentas `casa` y `apuestas_pendientes`

**Precisión decimal:**
- `LedgerEntry.amount`: `max_digits=18, decimal_places=4`
- Serializers wallet: `max_digits=18, decimal_places=4, min_value=Decimal('0.0001')`
- Frontend: `toFixed(4)`, inputs `step="0.0001"`, `min="0.0001"`

**Estados de cuenta:**
- `UserProfile.estado_cuenta`: pendiente_verificacion(default), verificado, bloqueado, autoexcluido
- Demo users → verificado

**Idempotencia en wallet:**
- `RecargarView` y `RetirarView` aceptan `X-Idempotency-Key` header
- Si la key ya fue procesada, retorna respuesta cacheada (previene doble gasto)
- Frontend genera `crypto.randomUUID()` en cada transacción
- `IdempotencyKey` model ya existente, ahora efectivamente usado

**Frontend:**
- Favicon: `vite.svg` → `ISOLOGO.png`
- Balance display: 4 decimales en AppBar, UserPanel, DepositModal, WithdrawModal
- `TransactionRequest` type incluye `idempotency_key?: string`

---

## Fase 2 - Sernaque: Events + Betting + WebSocket + Seed Masivo  ✅ CULMINADA (commit: 6f9ff78)

### Backend
- App `events`: Event, Market, Selection, Odds
- App `betting`: Bet, BetSelection, maquina de estados
- Crear apuesta simple con validaciones (saldo, verificada, no autoexcluida, monto min/max)
- Combinadas + exclusiones mutuas (mismo partido)
- Cash-out con formula: stake x odds_original / odds_actual x factor_casa
- Liquidacion de apuestas
- Django Channels: WebSocket /ws/events/<id>/ para odds en vivo
- Politica re-cotizacion: si odds cambio, exigir reconfirmacion
- **Seed masivo**: Liga 1, Premier, La Liga, Champions, Libertadores, NBA, ATP, WTA, Volleyball (~643+ partidos)
- ADRs #5-6

### Frontend
- EventsPage, EventCard, LiveBadge
- BettingPage, BetSlip, BetSlipItem, OddsButton
- BetHistory, CashOutButton
- MarketSelector, OddsDisplay
- LiveEventsPage, MyBetsPage
- WebSocket hook para odds en vivo

### Swagger
- Documentar: eventos, mercados, odds, crear apuesta, cash-out, WebSocket

### Endpoints
- `GET /api/events/`
- `GET /api/events/<id>/`
- `GET /api/events/live/`
- `POST /api/betting/apuesta/`
- `POST /api/betting/combinada/`
- `POST /api/betting/cash-out/<id>/`
- `WS /ws/events/<id>/`

---

## Fase 3 - Inon: Responsible Gaming + Audit + Anti-fraude  ✅ CULMINADA (commit: e5612e9)

### Backend
- App `responsible_gaming`: DepositLimits (diario, semanal, mensual), LimitChangeRequest, AutoExclusion (7d, 30d, 90d, indefinida)
- Middleware/signal bloquea apuestas si autoexcluido o excedio limites
- Bajar limites: instantaneo. Subir: cooldown 24h
- App `audit`: AuditLog con hash encadenado SHA256
- Funcion append_audit_log() con hash_prev
- Signals en LedgerEntry, Bet, Odds para registro automatico
- Anti-fraude: SuspiciousActivity (misma IP, patrones identicos, deposito + cash-out inmediato)
- Celery task periodico deteccion de patrones
- ADRs #7-9

### Frontend
- ProfilePage, LimitSettings
- AutoExclusionForm
- AuditLogViewer (admin)
- Admin: flagged users panel
- Mensaje "consumo responsable" en UI de apuestas

### Swagger
- Documentar: limites, autoexclusion, audit log, anti-fraude

### Endpoints
- `POST /api/responsible-gaming/limits/`
- `GET /api/responsible-gaming/limits/`
- `POST /api/responsible-gaming/auto-exclude/`
- `GET /api/admin/audit/verify/`
- `GET /api/admin/audit/logs/`
- `GET /api/admin/fraud/alerts/`

---

## Fase 4 - Gines: Bonuses + Operator Dashboard + Reportes  ✅ CULMINADA (commit: bf34635)

### Backend
- App `bonuses`: Bonus (bienvenida, recarga), UserBonus (saldo_bono, rollover_requerido, rollover_completado)
- Funcion aplicar_bono() - acredita a cuenta bonos
- Deteccion abuso bonos: apuestas sin riesgo (alta vs baja cuota cubriendo resultados)
- App `operator`: metricas en vivo
- Calcular GGR: SUM(stakes) - SUM(payouts)
- Calcular exposure por evento: cuanto pierde la casa si gana cada seleccion
- Reportes MINCETUR: CSV descargable (fecha, usuario, tipo_apuesta, stake, payout, resultado, evento, mercado)
- ADR #10

### Frontend
- BonusesPage, BonusCard, RolloverProgress
- AdminDashboard, AdminMetrics, ExposureChart
- AdminReports, CSVDownload
- OperatorMetricsPage

### Swagger
- Documentar: bonos, metricas, exposure, reportes MINCETUR

### Endpoints
- `GET /api/bonuses/available/`
- `POST /api/bonuses/apply/`
- `GET /api/bonuses/my-bonus/`
- `GET /api/operator/metrics/`
- `GET /api/operator/exposure/<event_id>/`
- `GET /api/operator/reporte/?mes=X&anio=Y`

---

## Fase 5 - Villazon: Integracion End-to-End + Frontend Completo + Docs  ✅ CULMINADA (commit: e758a8a)

### Backend
- Integrar flujos: registro -> KYC -> recarga -> apuesta -> liquidacion -> retiro
- Rate limiting agresivo en endpoints de apuesta y auth
- 2FA simulado para retiros (TOTP o codigo email)
- Logs JSON estructurados sin info sensible
- Middleware auditoria de requests
- Validacion permisos en endpoints admin

### Frontend
- Conectar todas las paginas con API
- Navigation, Sidebar, Footer
- Responsive design
- Loading states, error boundaries
- Toast notifications
- Admin panel completo

### Swagger
- Schema final completo
- Swagger UI + Redoc
- Generar OpenAPI spec

### Documentacion
- README con setup, docker-compose, instrucciones
- Diagrama ER
- Diagrama maquina de estados de Bet (Mermaid)
- Documento legal (Ley 31557): integridad financiera, juego responsable, requisitos cubiertos/no cubiertos
- Guardar todo en /docs/

---

## Docker Compose Final

```yaml
services:
  db:              # PostgreSQL 16
  redis:           # Redis 7 (cache + broker)
  backend:         # Django + Daphne (puerto 8000)
  frontend:        # Vite dev server (puerto 5173, proxy a backend)
  celery-worker:   # Celery worker
  celery-beat:     # Celery beat
```

---

## Seed Masivo (Fase 2 - Sernaque)

- **Futbol**: Liga 1 Peru (18 equipos), Premier League, La Liga, Champions, Libertadores
- **Tenis**: ATP, WTA (Grand Slams, Masters)
- **Basketball**: NBA, EuroLeague
- **Volleyball**: Liga Nacional, Mundial
- **~643+ partidos** con mercados 1X2, Over/Under, BTTS, Handicap
- **Odds realistas** generadas aleatoriamente
- **Partidos en vivo** con estado EN_VIVO

---

## Flujo de Comunicacion

```
Frontend (React)  --HTTP-->  Backend (Django REST API :8000)
                <--JSON--

Frontend (React)  --WS-->    Backend (Daphne WebSocket :8000)
                <--Odds--   (odds en vivo)
```

---

## RESUMEN FINAL — PROYECTO COMPLETADO

### Commits por fase

| Fase | Desarrollador | Commit | Entregables |
|------|--------------|--------|-------------|
| 1 | Barreto | `dc2d89c` | Clean Architecture backend (controllers/application/domain/infrastructure), JWT simplejwt, wallet partida doble, auth popups frontend, paleta negro+dorado |
| 1.5 | Challenge | `23720a6` | Partida doble real (DEBIT/CREDIT, transaction_id UUID), decimal(18,4), idempotencia wallet, favicon ISOLOGO, seed con cuenta casa + 2 usuarios demo |
| 2 | Sernaque | `6f9ff78` | Layout 3 columnas (LeftSidebar + CenterContent + BetSlip), EventCard con cuotas 1X2 directas, FeaturedCarousel auto-rotatorio, EventDetailView con tabs por categoría, 30+ mercados por evento (fútbol/tenis/basket/voleibol), BetSlip Simple/Combinada/Sistema, seed masivo 182 eventos |
| 3 | Inon | `e5612e9` | App `responsible_gaming` (DepositLimits, LimitChangeRequest con cooldown 24h, AutoExclusion 7d/30d/90d/indefinida), App `audit` (AuditLog con hash SHA256 encadenado, SuspiciousActivity), middleware IP, signals auditoría, celery tasks (fraud patterns 15min, reactivacion autoexclusion 1h), ProfilePage con tabs Limites/Autoexclusion |
| 4 | Gines | `bf34635` | App `bonuses` (Bonus bienvenida 100%/recarga 50%, UserBonus con rollover x5/x3), rollover integrado en betting (cuota >= 1.10 cuenta), App `operador` (Metrics GGR/stakes/usuarios, Exposure por evento, Reporte CSV MINCETUR), BonusesPage + AdminDashboard + ReportsPage, saldo real + bono en UserPanel y AppBar |
| 5 | Villazon | `e758a8a` | Cash-out UI en ActiveBets, refresh token simplejwt `/auth/token/refresh/`, DRF throttling (5/min auth, 30/min apuesta, 10/min wallet), hamburger menu mobile, sidebar colapsable, Footer legal, ErrorBoundary, loading spinners, 2FA simulado en retiros, KYC relajado para demo, liquidación admin protegida |

### Stack tecnológico final

| Capa | Tecnología |
|------|------------|
| Backend | Django 5 + DRF + Channels + Celery |
| Frontend | React 18 + Vite + TypeScript + TailwindCSS |
| UI | TailwindCSS (negro #000000 + dorado #d4af37) |
| State | React Query (server) + Zustand (client: balance + bonusBalance) |
| DB | PostgreSQL 16 |
| Cache/Broker | Redis 7 |
| Auth | JWT (simplejwt: access 1h, refresh 7d, rotate) |
| Docs | drf-spectacular (OpenAPI 3.0) + Swagger UI + Redoc |
| Logs | python-json-logger (JSON estructurado) |
| Infra | Docker Compose (6 servicios: db, redis, backend, frontend, celery-worker, celery-beat) |

### Rutas del frontend

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | HomePage (landing) | Público |
| `/betting` | BettingPage (3 columnas: sidebar + eventos + cupón/apuestas) | Público |
| `/live` | BettingPage (solo eventos en vivo) | Público |
| `/my-bets` | MyBetsPage (historial de apuestas) | Login |
| `/profile` | ProfilePage (perfil, límites, autoexclusión) | Login |
| `/bonuses` | BonusesPage (bonos disponibles + rollover) | Login |
| `/admin` | AdminDashboardPage (métricas GGR + exposure) | Admin |
| `/admin/reports` | ReportsPage (descarga CSV MINCETUR) | Admin |

### Endpoints del backend

| Módulo | Endpoints |
|--------|-----------|
| Auth | `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/token/refresh/`, `GET /api/auth/me/` |
| Wallet | `POST /api/wallet/recargar/`, `POST /api/wallet/retirar/`, `GET /api/wallet/saldo/?tipo=main\|bonus` |
| Events | `GET /api/events/`, `GET /api/events/live/`, `GET /api/events/sports/`, `GET /api/events/<id>/` |
| Betting | `POST /api/betting/apuesta/`, `POST /api/betting/cash-out/<id>/`, `GET /api/betting/mis-apuestas/`, `POST /api/betting/liquidar/<id>/` (admin) |
| Responsible Gaming | `GET/POST /api/responsible-gaming/limits/`, `POST /api/responsible-gaming/auto-exclude/` |
| Audit | `GET /api/admin/audit/logs/`, `GET /api/admin/audit/verify/`, `GET /api/admin/fraud/alerts/` |
| Bonuses | `GET /api/bonuses/available/`, `POST /api/bonuses/apply/`, `GET /api/bonuses/my-bonus/` |
| Operator | `GET /api/operator/metrics/`, `GET /api/operator/exposure/<id>/`, `GET /api/operator/reporte/?mes=X&anio=Y` |
| WebSocket | `WS /ws/events/<id>/` (odds en vivo) |

### Seguridad

- Rate limiting: 5/min auth, 30/min apuesta, 10/min wallet
- JWT con refresh token rotativo
- Liquidación y métricas protegidas con IsAdminUser
- Auditoría con hash SHA256 encadenado (verificable)
- IP capturada en middleware para anti-fraude
- 2FA simulado en retiros
- ErrorBoundary global en frontend
```
