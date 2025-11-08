from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routes import tasks

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="ToDo App")
origins = [
    "http://localhost:3000",  # frontend dev
    "http://127.0.0.1:3000",  # alternatywny localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # dozwolone źródła
    allow_credentials=True,
    allow_methods=["*"],        # wszystkie metody HTTP
    allow_headers=["*"],        # wszystkie nagłówki
)
app.include_router(tasks.router)
