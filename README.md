# FairBet Lab 🎲

[cite_start]**FairBet Lab** es una plataforma web educativa orientada a la simulación de apuestas deportivas utilizando **moneda virtual (BP)**[cite: 3]. [cite_start]Este proyecto pone un énfasis crítico en la integridad financiera, la concurrencia, el tiempo real y el cumplimiento normativo de juego responsable (inspirado en la Ley 31557 de Perú)[cite: 5].

> [cite_start]**Aviso Legal:** Esta es una plataforma estrictamente educativa con moneda virtual[cite: 6]. [cite_start]**No constituye una casa de apuestas real** ni integra pasarelas de pago con dinero fiduciario, y no convierte fichas a dinero[cite: 6, 7].

---

## 🚀 Características Principales (Alcance del Reto)

El proyecto cubre los tres niveles exigidos por el *Code Challenge*:

### [cite_start]Nivel 1 - Núcleo Obligatorio [cite: 17]
* **Wallet con Partida Doble:** Cada transacción (recarga, retiro, apuesta) genera entradas balanceadas (DÉBITO/CRÉDITO). [cite_start]El saldo siempre se calcula (`SUM(credits) - SUM(debits)`), nunca se almacena estáticamente[cite: 21, 23, 25].
* [cite_start]**Integridad Financiera:** Uso estricto del tipo `Decimal(18,4)` (prohibido el uso de `float`) y transacciones atómicas con `select_for_update` para prevenir el doble gasto[cite: 76, 78].
* [cite_start]**Máquina de Estados:** Ciclo de vida estricto para cada apuesta (Pendiente ➔ Accepted ➔ Won/Lost/CashedOut)[cite: 11].
* **Juego Responsable:** Límites diarios, semanales y mensuales bloqueantes. [cite_start]Autoexclusión temporal y permanente[cite: 39, 40, 41].

### [cite_start]Nivel 2 - Avanzado [cite: 43]
* [cite_start]**Apuestas Combinadas:** Soporte para múltiples selecciones con validación de eventos mutuamente excluyentes[cite: 44, 47].
* [cite_start]**Tiempo Real:** Actualización de cuotas (odds) en vivo a través de WebSockets y política de re-cotización en el ticket de apuesta[cite: 48, 49, 50].
* [cite_start]**Cash-Out:** Sistema de liquidación anticipada con recálculo dinámico de la cuota y factor de la casa[cite: 54, 55, 56].

### [cite_start]Nivel 3 - Compliance y Operación [cite: 58]
* [cite_start]**Auditoría Inmutable:** Registro de operaciones críticas protegido mediante encadenamiento de hashes `SHA-256`[cite: 59, 60].
* [cite_start]**Dashboard del Operador:** Panel de administración con métricas en vivo (GGR, exposición por evento) y reportes CSV[cite: 68, 69, 70].
* [cite_start]**Bonos:** Sistema de bonos promocionales con control de *rollover*[cite: 71, 72].

---

## 🏗️ Arquitectura y Tecnologías

El sistema está estructurado siguiendo los principios de **Clean Architecture**, aislando la lógica de dominio de los controladores HTTP y la infraestructura de datos.

* [cite_start]**Backend:** Django 5.x, Django REST Framework (DRF)[cite: 76].
* [cite_start]**Tiempo Real:** Django Channels y Redis[cite: 76].
* [cite_start]**Tareas Asíncronas:** Celery[cite: 76].
* [cite_start]**Base de Datos:** PostgreSQL 16[cite: 76].
* **Frontend:** React 18, Vite, TypeScript, TailwindCSS.
* **Estado:** Zustand (Cliente) y React Query (Servidor).
* [cite_start]**Testing:** Hypothesis (Property-based testing para invariantes financieras)[cite: 80].

---

## 🛠️ Instrucciones de Instalación (Docker)

El proyecto está completamente contenerizado, por lo que no es necesario instalar dependencias locales más allá de Docker.

**1. Clonar el repositorio:**
```bash
git clone [https://github.com/gsantoyoeduardo/Challenge-FairBet-Lab.git](https://github.com/gsantoyoeduardo/Challenge-FairBet-Lab.git)
cd Challenge-FairBet-Lab