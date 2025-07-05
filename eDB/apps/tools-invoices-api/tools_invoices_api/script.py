from google.oauth2 import service_account
from googleapiclient.discovery import build
from pathlib import Path

SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "service-account.json"

creds = service_account.Credentials.from_service_account_file(
    str(SERVICE_ACCOUNT_PATH),
    scopes=["https://www.googleapis.com/auth/drive.readonly"]
)

service = build('drive', 'v3', credentials=creds)

results = service.files().list(
    q="name='Invoices' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields="files(id, name)",
    supportsAllDrives=True,
    includeItemsFromAllDrives=True
).execute()

print(results)
