# eDB

---

## Documentation

---

### Technical docs

-   **1. Setup**
    -   [Client](./docs/client.docs.md)
    -   [API](./docs/api.docs.md)
-   **2. Environments**
    -   [Development](./docs/dev-env.docs.md)
    -   [Staging & Production](./docs/staging-prod-env.docs.md)
-   [**3. CI/CD**](./docs/cicd.docs.md)
-   [**4. VPS**](./docs/vps.docs.md)
-   [**5. Project Management and Documentation**](./docs/pm.docs.md)
-   [**6. Under the Hood**](./docs/in-depth.docs.md)
-   [**7. Handy Commands Cheat Sheet**](./docs/cheatsheet.docs.md)

---

### TLDR docs

#### Project Goal

I am building a platform housing multiple applications. Users can make an account, subscribe to the apps and launch them. So far I have one webshop in there.

#### Tech Stack

| Category             | Technology                 |
| -------------------- | -------------------------- |
| **Monorepo**         | Nx                         |
| **Client**           | Angular                    |
| **API**              | .NET API, Laravel API      |
| **Auth Server**      | Keycloak                   |
| **Database**         | PostgreSQL                 |
| **Containerization** | Docker                     |
| **Orchestration**    | K3s                        |
| **Hosting**          | Self-hosted VPS on Hetzner |
| **CI/CD**            | GitHub Actions             |

#### Achieved Goals

-   [x] **Containerizing applications** → Dockerfiles
-   [x] **Development environment** -> K3s cluster using k3d + Skaffold OR Nx + local postgres
-   [x] **Staging environment** → K3s cluster on VPS
-   [x] **Production environment** → K3s cluster on VPS
-   [x] **CI/CD pipelines** → For production and staging, with pre-merge checks and post-merge deployment (self-hosted ARM Github Actions runner on VPS)
-   [x] **Documentation**
-   [x] **Layered Modular Architecture** → Client and .NET API
-   [x] **Authentication** → Self-hosted Keycloak (login - register - profile - sessions - ...)
-   [x] **Platform Apps** → Added Demo App #1: Webshop

#### All Tools Used

**DevOps**

-   [x] **Docker**: Docker Compose - Docker Desktop - Docker Hub - Dockerfiles - Docker images - multi-stage
-   [x] **Kubernetes**: k3d - k3s - kubectl - Deployments - Services - Pods - Secrets - Configmaps - Certificates - NGINX Controller - Ingress - YAML
-   [x] **Servers**: - VPS
    -   [x] **OS** → Linux (Ubuntu)
    -   [x] **Static file web server** → NGINX
    -   [x] **API web server** → .NET Web API - Laravel PHP-FPM
    -   [x] **Database server** → Postgres
    -   [x] **Authentication server** → Keycloak
    -   [x] **Github Actions runner** → Self-hosted on VPS
    -   [x] **Shell scripts** (`wait-for-postgres.sh` / `entrypoint.sh`)
-   [x] **CI/CD**: Github Actions - `nx affected` - yamllint - staging/production environment - lint, test, build, deploy

**Monorepo**

-   [x] **Nx**:
    -   apps
    -   libs
        -   **client**: feature - util - data-access/client - ui
    -   Nx generators/scaffolding commands - `nx affected` - modular layered architecture

**Auth**

-   [x] **Authentication**: Keycloak - keycloak-js - JWT - firebase/php-jwt -

**Client**

-   [x] **Language**: Typescript
-   [x] **Node Package Manager**: pnpm
-   [x] **Frameworks**:
    -   [x] **Angular**: (Standalone) Components - Services - RxJS - Signals - Interceptors - Guards - Reactive Forms
-   [x] **Testing**: Vitest - Storybook
-   [x] **Linting + formatting**: Prettier - ESLint
-   [x] **UI**: HTML - SCSS - Tailwind - Carbon Design System - Angular Material - FontAwesome
-   [x] **API Integration**: TanStack Query
-   [x] **Bundler**: Webpack

**API**

-   [x] **Language**: C# - PHP
-   [x] **Package Manager**: NuGet - Composer
-   [x] **Frameworks**:
    -   [x] **.NET**: Controllers - Services - Repositories - Entities - DTOs - Extensions - Interfaces - MappingProfiles - Middleware (exception middleware) - Migrations - .NET CLI - Fluent API - JWT - CORS - Attributes - DbContext - .NET SDK
    -   [x] **Laravel**: Controllers - Models - Requests - Resources - Collections - PHP Artisan CLI - Middleware - Migrations - Seeders - Factories
-   [x] **ORM**: EF - Doctrine
-   [x] **Testing**: xUnit - Moq - Postman
-   [x] **Formatting**: dotnet format
-   [x] **API Documentation**: Swagger
-   [x] **Object Mapper**: Automapper
-   [x] **Database**: PostgreSQL - pgAdmin 4

---

#### Tools I'm working towards using

**DevOps**

-   [ ] **Monitoring & analytics**: Grafana, Prometheus
-   [ ] **Secrets Management**: HashiCorp Vault, SealedSecrets, External Secrets Operator
-   [ ] **Logging & Distributed Tracing**: ELK Stack (Elasticsearch, Logstash, Kibana), Fluentd, Loki
-   [ ] **Cluster Management**: ArgoCD (GitOps), Helm, Kustomize
-   [ ] **Hotfixes and Feature Flags**
-   [ ] **Load balancing**
-   [ ] **Caching & Performance Optimization**: Nx Cloud, TurboRepo
-   [ ] **Azure**
    -   [ ] **Azure Kubernetes Service (AKS)** – Managed Kubernetes instead of K3s
    -   [ ] **Azure Container Registry (ACR)** – Store and manage Docker images
    -   [ ] **Azure DevOps Pipelines** – Alternative to GitHub Actions
    -   [ ] **Azure Resource Manager (ARM) / Terraform / Bicep** – Infrastructure as Code (IaC)
    -   [ ] **Azure App Service** – Deploy apps without full Kubernetes
    -   [ ] **Azure Functions** – Serverless execution for background jobs

**Client**

-   [ ] **Microfrontends**: Module Federation
-   [ ] **End-to-End Testing**: Cypress, Playwright
-   [ ] **State Management**: NgRx, Akita, SignalStore
-   [ ] **Error Handling & Monitoring**: Sentry, PostHog
-   [ ] **Accessibility (a11y) Testing**: Axe DevTools, Lighthouse

**API**

-   [ ] **Architecture**: Event Driven Architecture, Domain Driven Architecture
-   [ ] **Background Jobs & Messaging**: Hangfire, MassTransit, MediatR, RabbitMQ, Kafka
-   [ ] **Caching**: Redis
-   [ ] **Rate Limiting & API Gateway**: Ocelot, YARP, Envoy
-   [ ] **Feature Flags & Config Management**: Unleash, ConfigCat
