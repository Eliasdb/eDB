from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .fetch_from_drive import fetch_all_invoice_data  # your utility function


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    global invoices_cache
    invoices_cache = fetch_all_invoice_data()


@app.get("/")
def get_invoices():
    return invoices_cache
