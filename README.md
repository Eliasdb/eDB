# eDB

---

## 🌐 Access & Environments

Here's an overview of the key resources of this platform:

| Purpose                    | URL                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------- |
| 🧾 Technical Documentation | [https://eliasdebock.com/nl/docs/eDB/intro](https://eliasdebock.com/nl/docs/eDB/intro) |
| 🚧 Staging Environment     | [https://app.staging.eliasdebock.com](https://app.staging.eliasdebock.com)             |
| 🚀 Production Environment  | [https://app.eliasdebock.com](https://app.eliasdebock.com)                             |
| 📊 Monitoring & Logging    | [https://grafana.staging.eliasdebock.com](https://grafana.staging.eliasdebock.com)     |

---

### TLDR docs

#### Project Goal

I am building a platform housing multiple applications. Users can make an account, subscribe to the apps and launch them. So far I have one webshop in there.

#### 🧰 Tech Stack

| Category             | Technology                                          |
| -------------------- | --------------------------------------------------- |
| **Monorepo**         | Nx                                                  |
| **Client**           | Angular - React                                     |
| **API**              | .NET API - Laravel API                              |
| **Auth Server**      | Keycloak                                            |
| **Database**         | PostgreSQL                                          |
| **Containerization** | Docker                                              |
| **Orchestration**    | K3s                                                 |
| **Hosting**          | VPS on Hetzner                                      |
| **OS**               | Ubuntu                                              |
| **CI/CD**            | GitHub Actions                                      |
| **File Storage**     | Cloudflare R2                                       |
| **Domains & DNS**    | Cloudflare                                          |
| **Monitoring**       | Prometheus + Grafana + Loki                         |
| **Testing**          | Vitest (frontend) · xUnit + Moq (.NET backend)      |
| **Build Tooling**    | Vite (frontend) · Webpack (Angular-specific setups) |

---

### 🏁 Achieved Goals

#### 🐳 Infrastructure & Deployment

-   [x] **Containerizing applications** → Dockerfiles
-   [x] **Development environment** → K3s cluster using k3d + Skaffold or Nx + local Postgres
-   [x] **Staging environment** → K3s cluster on VPS
-   [x] **Production environment** → K3s cluster on VPS
-   [x] **CI/CD pipelines** → Pre-merge checks + post-merge deploy via self-hosted ARM GitHub Actions runner

#### 🖥️ Client

-   [x] **Microfrontends** → Implemented using dynamic Module Federation and Web Components
-   [x] **Layered Modular Architecture** → apps and libs

#### 🔐 Identity & Access

-   [x] **Authentication** → Self-hosted Keycloak (login, register, profile, sessions, ...)

#### 📚 Documentation

-   [x] **Documentation** → Technical docs hosted and maintained

#### 📊 Monitoring & Observability

-   [x] **Dashboards for centralized logging and platform metrics** → Implemented with Grafana, Prometheus, Loki, and Promtail

#### 🧩 Platform Apps

-   [x] **Demo App #1** → Webshop (deployed as a full platform application)

---

### All Tools Used

**DevOps**

-   [x] **Docker**: Docker Compose - Docker Desktop - Docker Hub - Dockerfiles - Docker images - multi-stage
-   [x] **Kubernetes**: k3d - k3s - kubectl - Deployments - Services - Pods - Secrets - Configmaps - Certificates - NGINX Controller - Ingress - YAML - Namespaces

    -   [x] **Package Manager**: Helm

-   [x] **Servers**: - VPS
    -   [x] **OS** → Linux (Ubuntu)
    -   [x] **Static file web server** → NGINX
    -   [x] **API web server** → .NET Web API - Laravel PHP-FPM
    -   [x] **Database server** → Postgres
    -   [x] **Authentication server** → Keycloak
    -   [x] **Github Actions runner** → Self-hosted on VPS
    -   [x] **Shell scripts** (`wait-for-postgres.sh` / `entrypoint.sh`)
-   [x] **CI/CD**: Github Actions - `nx affected` - yamllint - staging/production environment - lint, test, build, deploy

-   [x] **Monitoring & analytics**: Grafana, Prometheus
-   [x] **Logging**: Loki, Promtrail

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
    -   [x] **React**: as Micro UI - built as UMD bundle in Vite integrated with Webcomponents
-   [x] **Testing**: Vitest - Storybook
-   [x] **Linting + formatting**: Prettier - ESLint
-   [x] **UI**: HTML - SCSS - Tailwind - Carbon Design System - Angular Material - FontAwesome
-   [x] **API Integration**: TanStack Query
-   [x] **Bundler**: Webpack - Vite
-   [x] **Microfrontends**: Dynamic Module Federation - Web Components

**API**

-   [x] **Language**: C# - PHP - Python
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

**PM**

-   [x] Jira

---

#### Tools I'm working towards using

**DevOps**

-   [ ] **Secrets Management**: HashiCorp Vault, SealedSecrets, External Secrets Operator
-   [ ] **Logging & Distributed Tracing**: ELK Stack (Elasticsearch, Logstash, Kibana)
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
