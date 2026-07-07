from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, TokenResponse, UsuarioOut
from app.security import verify_password, create_access_token, decode_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Autenticacion"]
)

security_scheme = HTTPBearer(auto_error=False)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.username == data.username, Usuario.activo == True)
        .first()
    )
    if not usuario or not verify_password(data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = create_access_token(
        {"sub": usuario.username, "rol": usuario.rol, "id": usuario.id}
    )
    return TokenResponse(access_token=token, usuario=usuario)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """Dependencia reutilizable para proteger endpoints: requiere Bearer token válido."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = decode_access_token(credentials.credentials)
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    usuario = db.query(Usuario).filter(Usuario.username == username).first()
    if not usuario or not usuario.activo:
        raise HTTPException(status_code=401, detail="Usuario no válido")
    return usuario


@router.get("/me", response_model=UsuarioOut)
def me(usuario: Usuario = Depends(get_current_user)):
    return usuario
