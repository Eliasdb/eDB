# eDB

## Documentation

-   [1. Project Goal](#1-project-goal)
-   [2. In Depth](./docs/in-depth.docs.md)
-   [3. Setup](#3-setup)
    -   [Client](./docs/client.docs.md)
    -   [API](./docs/api.docs.md)
-   [4. Environments]
    -   [Development](./docs/dev-env.docs.md)
    -   [Staging & Production](./docs/staging-prod.docs.md)
-   [5. CI/CD](#5-cicd)
-   [6. Database](#6-database)
-   [7. VPS](./docs/vps.docs.md)
-   [8. Project Management and Documentation](./docs/pm.docs.md)
-   [9. Handy Commands Cheat Sheet](./docs/cheatsheet.docs.md)
-   [10. Achieved Goals](#10-achieved-goals)
-   [11. TLDR: All Tools Used](#11-tldr-all-tools-used)
-   [12. Tools I'm working towards using](#12-tools-im-working-towards-using)

---

## 1. Project Goal

I am building a platform housing multiple applications. Users can make an account, subscribe to the apps and launch them.

## 3. Setup

This project uses Nx to efficiently manage multiple applications and shared libraries within a monorepo structure. Nx provides several key advantages:

### 🚀 **Why Use Nx?**

1. **Modular Architecture** – Nx helps divide the project into separate **apps** and **reusable libraries**, promoting maintainability and scalability.
2. **Efficient CI/CD** – With `nx affected`, only the changed parts of the codebase are rebuilt and tested, making the CI process **faster and more efficient**.
3. **Code Sharing** – Shared libraries eliminate code duplication by allowing different applications to **reuse UI components, utilities, and services**.
4. **Better Developer Experience** – Nx provides **powerful CLI tools**, **caching**, and **dependency graph visualization**, making development more streamlined.
5. **Optimized Builds** – Nx uses smart caching and incremental builds, ensuring that only necessary files are compiled, reducing build times.
6. **Consistent Tooling** – It enforces best practices by integrating with Angular, React, TypeScript, Jest, ESLint, Storybook, and other tools seamlessly.

By leveraging Nx, this monorepo allows for a more structured, scalable, and optimized development workflow, making it easier to maintain and extend over time.

## Initially I used this only for the frontend. Using the `@nx-dotnet/core` package I was able to get my frontend and backend code together in this one codebase.

## 6. Database

**Database**: PostgreSQL

---

## 10. Achieved Goals

-   [x] Containerizing applications (Dockerfiles)
-   [x] Development environment (k3s cluster using k3d managed with Skaffold OR Nx)
-   [x] Staging environment (k3s cluster on VPS)
-   [x] Production environment (k3s cluster on VPS)
-   [x] CI/CD pipelines for production and staging, with pre-merge checks and post-merge deployment (self-hosted ARM Github Actions runner on VPS).
-   [x] Documentation
-   [x] Layered Modular Architecture for Client and .NET API
-   [x] Authentication with self-hosted Keycloak (login - register - profile - sessions - ...)
-   [x] Added Demo App #1 Webshop

## 11. TLDR: All Tools Used

**DevOps**

-   [x] **Docker**: Docker Compose - Docker Desktop - Docker Hub - Dockerfiles - Docker images - multi-stage
-   [x] **Kubernetes**: k3d - k3s - kubectl - Ingress - Deployments - Services - Pods - Secrets - Configmaps - YAML - Certificates - NGINX Controller
-   [x] **Servers**: Linux (Ubuntu) - VPS
-   Static file web server → NGINX
-   API web server → .NET Web API - Laravel PHP-FPM
-   Database server → Postgres
-   Authentication server → Keycloak
-   shell scripts (`wait-for-postgres.sh` / `entrypoint.sh`)
-   [x] **CI/CD**: Github Actions - GitFlow - `nx affected` - yamllint

**Monorepo**

-   [x] **Nx**: apps - libs - Nx generators/scaffolding commands - `nx affected` - modular layered architecture

**Auth**

-   [x] **Authentication**: Keycloak - keycloak-js

**Client**

-   [x] **Language**: Typescript
-   [x] **Node Package Manager**: pnpm
-   [x] **Angular**: (Standalone) Components - Services - RxJS - Signals - Interceptors - Guards - Reactive Forms
-   [x] **Testing**: Vitest - Storybook
-   [x] **Linting + formatting**: Prettier - ESLint
-   [x] **UI**: HTML - SCSS - Tailwind - Carbon Design System - Angular Material - FontAwesome
-   [x] **API Integration**: TanStack Query

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

## 12. Tools I'm working towards using

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
