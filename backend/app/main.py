from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine, SessionLocal

# Importar los modelos para registrarlos en Base.metadata antes de crear las tablas.
from app.models.equipo import Equipo
from app.models.accesorio import Accesorio
from app.models.movimiento import Movimiento
from app.models.detalle_movimiento import DetalleMovimiento
from app.models.qr_usuario import QRUsuario
from app.models.usuario_externo import UsuarioExterno
from app.models.usuario import Usuario
from app.security import hash_password

from app.routes.auth import router as auth_router
from app.routes.equipos import router as equipos_router
from app.routes.accesorios import router as accesorios_router
from app.routes.qr import router as qr_router
from app.routes.movimientos import router as movimientos_router
from app.routes.porteria import router as porteria_router
from app.routes.usuarios_externo import router as usuarios_externo_router
from app.routes.dashboard import router as dashboard_router
from app.routes.reportes import router as reportes_router
from app.routes.personas import router as personas_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crear las tablas del backend (equipos, movimientos, etc.) al arrancar."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Tablas verificadas/creadas correctamente.")
        # Sembrar usuarios por defecto si no existen.
        db = SessionLocal()
        try:
            if not db.query(Usuario).first():
                db.add(Usuario(
                    username="admin",
                    password_hash=hash_password("admin123"),
                    nombre="Administrador",
                    rol="admin",
                ))
                db.add(Usuario(
                    username="portero",
                    password_hash=hash_password("portero123"),
                    nombre="Portero",
                    rol="portero",
                ))
                db.commit()
                print("Usuarios por defecto creados: admin/admin123 y portero/portero123.")
        finally:
            db.close()
    except Exception as e:
        print(f"No se pudieron crear las tablas: {e}")
    yield


app = FastAPI(
    title="Control Equipos SENA",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(equipos_router)
app.include_router(accesorios_router)
app.include_router(qr_router)
app.include_router(movimientos_router)
app.include_router(porteria_router)
app.include_router(usuarios_externo_router)
app.include_router(dashboard_router)
app.include_router(reportes_router)
app.include_router(personas_router)


@app.get("/")
def root():
    return {
        "mensaje": "API Control Equipos SENA"
    }
