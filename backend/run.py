"""
run.py — Entry point del servidor backend.
Ejecutar con: python run.py
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,          # Hot reload en desarrollo
        log_level="info",
    )
