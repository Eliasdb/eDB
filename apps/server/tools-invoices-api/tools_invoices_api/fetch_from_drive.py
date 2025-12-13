import io
from pathlib import Path

import httplib2
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

from .extract_invoice_data import extract_invoice_data_from_bytes

FOLDER_PATH = ["Invoices", "Hetzner", "2025"]

# Dynamically build the full path to the JSON file
SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "service-account.json"

creds = service_account.Credentials.from_service_account_file(
    str(SERVICE_ACCOUNT_PATH),
    scopes=["https://www.googleapis.com/auth/drive.readonly"],
)

httplib2.debuglevel = 4  # Enable HTTP debug globally
service = build("drive", "v3", credentials=creds)


def get_folder_id_by_path(path_parts):
    results = service.files().list(
        q=(
            "name = '{root}' and mimeType = 'application/vnd.google-apps.folder' "
            "and trashed = false"
        ).format(root=path_parts[0]),
        fields="files(id, name)",
        supportsAllDrives=True,
        includeItemsFromAllDrives=True,
    ).execute()

    folders = results.get("files", [])
    if not folders:
        raise Exception(f"Folder '{path_parts[0]}' not found.")
    current_folder_id = folders[0]["id"]

    for part in path_parts[1:]:
        children = (
            service.files()
            .list(
                q=(
                    f"'{current_folder_id}' in parents and name = '{part}' "
                    "and mimeType = 'application/vnd.google-apps.folder'"
                ),
                fields="files(id, name)",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
            .get("files", [])
        )
        if not children:
            raise Exception(f"Folder '{part}' not found under {current_folder_id}")
        current_folder_id = children[0]["id"]

    return current_folder_id


def list_all_pdfs_recursive(folder_id):
    all_pdfs = []

    def recurse(folder):
        files = (
            service.files()
            .list(
                q=f"'{folder}' in parents and trashed = false",
                fields="files(id, name, mimeType, createdTime)",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
            .get("files", [])
        )

        for f in files:
            if f["mimeType"] == "application/pdf":
                all_pdfs.append(f)
            elif f["mimeType"] == "application/vnd.google-apps.folder":
                recurse(f["id"])

    recurse(folder_id)
    return all_pdfs


def download_pdf_text(file_id):
    buffer = io.BytesIO()
    request = service.files().get_media(fileId=file_id)
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    return buffer.getvalue()


def fetch_all_invoice_data():
    folder_id = get_folder_id_by_path(FOLDER_PATH)
    pdfs = list_all_pdfs_recursive(folder_id)

    extracted = []
    for pdf in pdfs:
        content = download_pdf_text(pdf["id"])
        extracted.append(extract_invoice_data_from_bytes(content, pdf["name"]))

    return extracted
