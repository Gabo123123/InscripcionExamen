from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_username: str
    admin_nombre: str | None = None


class AdminInfo(BaseModel):
    id: int
    username: str
    nombre_completo: str | None = None

    model_config = {"from_attributes": True}
