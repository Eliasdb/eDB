# Development Environment

# Run locally

docker run -d --name rabbitmq \
 -p 5672:5672 -p 15672:15672 \
 -e RABBITMQ_DEFAULT_USER=dev \
 -e RABBITMQ_DEFAULT_PASS=dev \
 -v rabbitmq-data:/var/lib/rabbitmq \
 rabbitmq:3.13-management

# Laravel Integration

2. Create the migration for MyDbContext (replace the name if different)
   bash
   Copy
   Edit
   dotnet ef migrations add AddNotifications \
    -p libs/shared/server/data-access/EDb.DataAccess.csproj \
    -s apps/server/platform-api/EDb.PlatformApi.csproj \
    --context MyDbContext \
    --output-dir Migrations
3. Apply it
   bash
   Copy
   Edit
   dotnet ef database update \
    -p libs/shared/server/data-access/EDb.DataAccess.csproj \
    -s apps/server/platform-api/EDb.PlatformApi.csproj \
    --context MyDbContext

# STaging setup

<!-- Add bitnami -->

➜ eDB git:(sprint-2) ✗ helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

 <!-- add namespace -->

kubectl create namespace messaging

<!-- make values file  -->

> rabbitmq-values.yaml

<!-- install rabbitmq  -->

helm upgrade --install rabbitmq bitnami/rabbitmq \
 -f k8s/staging/messaging/rabbitmq-values.yaml \
 -n messaging --create-namespace
