"""Serve the existing React build and API from one Render web service."""
from pathlib import Path
from fastapi import HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from main import app

STATIC_DIR = Path(__file__).resolve().parent / 'static'
# The existing '/' API status route is replaced only in this cloud entry point.
app.router.routes[:] = [route for route in app.router.routes if getattr(route, 'path', None) != '/']
app.mount('/assets', StaticFiles(directory=STATIC_DIR / 'assets'), name='static-assets')

@app.get('/{path:path}', include_in_schema=False)
def frontend(path: str):
    if path == 'api' or path.startswith('api/'):
        raise HTTPException(status_code=404, detail='Not found')
    candidate = (STATIC_DIR / path).resolve()
    if candidate.is_relative_to(STATIC_DIR) and candidate.is_file():
        return FileResponse(candidate)
    return FileResponse(STATIC_DIR / 'index.html')
