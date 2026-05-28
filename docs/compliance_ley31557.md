# Documento de Compliance y Arquitectura Financiera
# Proyecto: FairBet Lab (Plataforma Educativa con Moneda Virtual)


## 1. Garantía de Integridad Financiera
La plataforma FairBet Lab ha sido diseñada desde su concepción para tratar la moneda virtual (BP) con el mismo rigor que un entorno transaccional real. Para garantizar que ningún usuario pueda generar dinero de la nada ni perder saldo por errores del sistema, se implementaron las siguientes directrices arquitectónicas:


Contabilidad de Partida Doble: Se abandonó el modelo de "saldo estático" en la tabla de usuarios. En su lugar, el sistema utiliza un modelo LedgerEntry. Cada operación financiera (recarga, retiro, apuesta, liquidación) genera obligatoriamente dos entradas balanceadas: un DÉBITO y un CRÉDITO.


Saldo Derivado: El saldo actual de un usuario jamás se almacena; siempre se calcula al vuelo mediante la fórmula SUM(CREDIT) - SUM(DEBIT).


Precisión Decimal Rigurosa: Se erradicó el uso del tipo de dato float. Todas las transacciones utilizan el tipo Decimal(18,4) de PostgreSQL para evitar pérdidas de precisión por redondeo flotante.
Concurrencia y Prevención de Doble Gasto: Para evitar condiciones de carrera (ej. un usuario haciendo doble clic rápido en "Apostar"), toda transacción se envuelve en un bloque atómico (transaction.atomic) y utiliza bloqueos pesimistas en la base de datos (select_for_update). Además, los endpoints expuestos emplean llaves de idempotencia (X-Idempotency-Key).


## 2. Políticas de Juego Responsable
En cumplimiento con los estándares éticos y los requerimientos funcionales del Nivel 1, FairBet Lab impone restricciones estrictas para proteger al usuario:

Límites de Depósito: Los usuarios pueden configurar límites diarios, semanales y mensuales. La reducción de un límite tiene efecto inmediato, mientras que la solicitud para aumentar un límite entra en un período de cooldown obligatorio de 24 horas.

Autoexclusión Irreversible: Se implementó un sistema de autoexclusión que bloquea cualquier intento de apuesta o recarga por períodos de 7, 30, 90 días o de forma indefinida. Esta acción no puede ser revertida por el usuario ni por el administrador de soporte antes de que venza el plazo.

Visibilidad de Advertencias: El banner con el mensaje "El juego con exceso puede causar adicción. Juega con responsabilidad" se inyecta transversalmente en toda la interfaz (UI) de apuestas.

## 3. Cobertura de la Ley 31557 y DS 005-2023-MINCETUR
El reto exigía alinearse normativamente a la Ley 31557 (Ley que regula la explotación de los juegos a distancia y apuestas deportivas a distancia en Perú).
### Requisitos Cubiertos por el Sistema

Auditoría Inmutable: Se implementó un registro (append-only) de las acciones críticas (apuestas, cambios de cuotas) protegido por una cadena de hashes criptográficos (SHA-256) . Esto simula la caja fuerte de datos exigida por MINCETUR.

Reportes de Operador: El panel de administración permite la exportación en formato CSV de la actividad mensual , simulando la estructura de reporte de ingresos brutos (GGR) requerida por el regulador.

KYC Básico: El registro exige DNI peruano y validación de mayoría de edad (≥ 18 años).

### Autocrítica: Requisitos No Cubiertos
Siendo FairBet Lab una plataforma estrictamente educativa, existen brechas respecto a una operación comercial formal:
Validación de Identidad (RENIEC): Aunque el sistema valida el formato y el dígito verificador del DNI peruano, no se integra con pasarelas biométricas ni con la base de datos de RENIEC en tiempo real para verificar si la persona existe o está viva.
Homologación de Laboratorios (GLI): Nuestro generador de números y cuotas, así como el servidor, no han pasado por la certificación de laboratorios internacionales autorizados por MINCETUR.
Prevención de Lavado de Activos (SPLAFT): No estamos reportando operaciones inusuales (ROI) o sospechosas (ROS) a la Unidad de Inteligencia Financiera (UIF-Perú), dado que operamos en un entorno cerrado sin pasarelas de pago ni riesgo real de lavado.

