# SENA Yamboro — Control de Equipos y Portería

Sistema para controlar el **ingreso/salida de personas y equipos** (portátiles, tablets, etc.)
en la portería del SENA Yamboro, con **código QR** por persona, dashboard y reportes.

Estado actual del repositorio:
 **Backend** en Python/FastAPI (con **login** JWT) — listo y dockerizado.
 **Frontend** en **React** .

---

## Tecnologías

- **Backend:** Python 3.11 + FastAPI + SQLAlchemy · Auth con JWT (PyJWT) + bcrypt
- **Base de datos:** PostgreSQL 16 (BD `porteria`) + BD de prueba `erp_sena` (mock del ERP)
- **Frontend:** React 18 + Vite + TypeScript (a construir)
- **Contenedores:** Docker + Docker Compose

---

## Cómo correr el backend (Docker)

```bash
docker compose up --build -d db backend

# API + documentación interactiva:
#   http://localhost:8000/docs
```

Esto levanta:
- **db**: PostgreSQL con las bases `porteria` y `erp_sena` (esta última con 5 personas demo).
- **backend**: FastAPI en http://localhost:8000 (crea sus tablas y usuarios por defecto al iniciar).

### Usuarios por defecto (login)

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | admin |
| `portero` | `portero123` | portero |

Probar login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Estructura

```
/
├── backend/                 # FastAPI (Python)
│   ├── app/
│   │   ├── main.py          # arranque, CORS, routers, creación de tablas + seed de usuarios
│   │   ├── security.py      # bcrypt + JWT
│   │   ├── database/        # conexión a 'porteria' y a 'erp_sena'
│   │   ├── models/          # equipos, movimientos, qr, externos, usuarios (login), ...
│   │   ├── schemas/         # Pydantic (incluye auth)
│   │   ├── repositories/    # acceso a datos
│   │   ├── services/        # lógica de negocio
│   │   └── routes/          # endpoints (auth, equipos, porteria, dashboard, ...)
│   ├── requirements.txt
│   └── Dockerfile
├── db/
│   └── init/01_erp_sena.sql # crea la BD erp_sena + personas demo
├── docker-compose.yml
└── PROMPT-recrear-react-python.md   # especificación para construir el frontend React
```

---

## Base de datos

- `porteria` — datos del sistema (equipos, movimientos, QR, usuarios externos, usuarios de login).
- `erp_sena` — **simulación** del ERP institucional; el backend busca aquí a las personas
  (aprendices/instructores) por cédula o UUID. En producción se apuntaría al ERP real vía las
  variables `DB_*` (misma conexión) o configurando `NEST_API_URL`.

Conexión externa a la BD (pgAdmin/DBeaver): host `localhost`, puerto **5435**, usuario `sena_user`,
contraseña `sena_pass`.

---


