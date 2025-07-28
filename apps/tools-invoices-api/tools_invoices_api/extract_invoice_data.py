# extract_invoice_data.py

import fitz  # PyMuPDF
import re

def extract_invoice_data_from_bytes(file_bytes, file_name=""):
    doc = fitz.open("pdf", file_bytes)
    text = "\n".join(page.get_text() for page in doc)

    net_vat_total_match = re.search(r"Total\s+€\s*([\d.,]+)\s+€\s*([\d.,]+)\s+€\s*([\d.,]+)", text)

    data = {
        "file": file_name,
        "invoice_number": re.search(r"Invoice no\.?\:?\s*([0-9]+)", text),
        "invoice_date": re.search(r"Invoice date\:?\s*([0-9]{2}/[0-9]{2}/[0-9]{4})", text),
        "service_period": re.search(r"(\d{2}/\d{4})\s+€", text),
        "net": None,
        "vat": None,
        "total": re.search(r"Amount due\:\s*€\s*([\d.,]+)", text),
    }

    if net_vat_total_match:
        data["net"] = net_vat_total_match.group(1)
        data["vat"] = net_vat_total_match.group(2)

    return {k: (v.group(1) if hasattr(v, "group") else v) for k, v in data.items()}
