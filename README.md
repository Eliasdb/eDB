# eDB

---

#### Project Goal

I'm building a modular platform that allows users to create an account, subscribe to various applications, and launch them from a central dashboard.

---

#### What’s Built So Far

<details>
<summary><strong>🧑‍💼 Admin Dashboard</strong></summary>

A centralized admin interface to:

- Manage user accounts and platform subscriptions
- View and manage the global product catalog
- Track and fulfill webshop orders

</details>

<details>
<summary><strong>🛒 Webshop</strong></summary>

A complete e-commerce solution with:

- Product catalog
- Shopping cart
- Checkout flow
- Order history and tracking
- **AI Mode** powered by `gpt-4o-mini` and Meilisearch, allowing users to search the catalog using natural language queries

</details>

<details>
<summary><strong>📊 ERP (Enterprise Resource Planning)</strong></summary>

Currently includes an **Accounting module** to:

- Track business expenses
- Manage VAT (BTW) reporting

</details>

<details>
<summary><strong>🧾 CRM (Customer Relationship Management)</strong></summary>

Includes a module for:

- Managing companies
- Tracking contacts associated with each company

</details>

---

#### 🧰 Tech Stack

##### 🧱 Architecture & Core Stack

| Category          | Technology                     |
| ----------------- | ------------------------------ |
| **Monorepo**      | Nx                             |
| **Languages**     | Typescript · C# · PHP · Python |
| **Client**        | Angular                        |
|                   | React                          |
| **API**           | .NET                           |
|                   | Laravel                        |
|                   | FastAPI                        |
| **Auth Server**   | Keycloak                       |
| **Database**      | PostgreSQL                     |
| **Domains & DNS** | Cloudflare                     |
| **OS**            | Ubuntu                         |
| **Hosting**       | VPS on Hetzner                 |

---

##### 🧠 AI, Search & Personalization

| Category          | Technology  |
| ----------------- | ----------- |
| **AI Models**     | GPT-4o-mini |
| **Search Engine** | Meilisearch |

---

##### 🛠️ DevOps & Tooling

| Category             | Technology          |
| -------------------- | ------------------- |
| **Containerization** | Docker              |
| **Orchestration**    | K3s                 |
| **GitOps**           | Argo CD · Kustomize |
| **CI/CD**            | GitHub Actions      |
| **Monitoring**       | Prometheus          |
|                      | Grafana             |
|                      | Loki · Promtail     |

---

##### 🧪 Testing & Build Tools

| Category               | Technology        |
| ---------------------- | ----------------- |
| **Frontend Testing**   | Vitest            |
| **End-to-End Testing** | Playwright        |
| **Backend Testing**    | xUnit · Postman   |
|                        | Moq               |
| **UI Component Dev**   | Storybook         |
| **API Documentation**  | Scalar            |
| **Build Tooling**      | Vite (React)      |
|                        | Webpack (Angular) |

---

##### 📡 Messaging & Real-Time

| Category                | Technology           |
| ----------------------- | -------------------- |
| **Message Broker**      | RabbitMQ             |
| **Service Messaging**   | MassTransit (.NET)   |
| **Real-Time Transport** | SignalR (WebSockets) |

---

### 🏁 Achieved Goals

- **Infrastructure & Deployment:**
  - Containerizing applications with Dockerfiles
  - Development environment using Makefiles + Docker Compose
  - Staging/production environment on a K3s cluster (Hetzner VPS)
  - CI/CD pipelines with pre-merge lint-test-build and post-merge deploy on self-hosted ARM GitHub Actions runner
  - GitOps deployments managed with Argo CD syncing manifests from GitHub (declarative, environment-aware)

- **Client (Frontend):**
  - Microfrontends with dynamic Module Federation and Web Components
  - Layered Modular Architecture with apps and libraries (feature, data-access, ui, util, etc.)

- **Identity & Access:**
  - Self-hosted Keycloak for authentication (login, registration, profile management, session handling)

- **Messaging & Real-Time:**
  - RabbitMQ as message broker
  - MassTransit (.NET) for async, resilient communication
  - SignalR for real-time UI updates (orders, notifications in Angular dashboard)

- **Documentation:**
  - Internal developer documentation, actively maintained and hosted

- **Monitoring & Observability:**
  - Grafana, Prometheus, Loki, Promtail setup
  - Centralized logging, metrics, dashboards, and observability

---

### Tools I'm working towards using

**Client**

- [ ] **State Management**: NgRx · Akita · SignalStore
- [ ] **Error Handling & Monitoring**: Sentry · PostHog
- [ ] **Accessibility (a11y) Testing**: Axe DevTools · Lighthouse

---

**DevOps**

- [ ] **Secrets Management**: HashiCorp Vault · SealedSecrets · External Secrets Operator
- [ ] **Load Balancing**: ServiceLB -> MetalLB
- [ ] **Hotfixes & Feature Flags**: Unleash · ConfigCat
- [ ] **Infrastructure as Code (IaC)**: Terraform · Ansible
- [ ] **Logging & Distributed Tracing/Search Engine**: ELK Stack (Elasticsearch · Logstash · Kibana)

---

**API**

- [ ] **Architecture**: Domain-Driven Design · Clean Architecture (incremental)
- [ ] **Background Jobs & Messaging**: Hangfire · MediatR · Kafka
- [ ] **Caching**: Redis (enable & add invalidation strategy)
- [ ] **Rate Limiting & API Gateway**: Ocelot · YARP · Envoy

---

**Cloud & Platform Services**

- [ ] **Cloud Provider**: Azure (planned)
  - [ ] **Azure Kubernetes Service (AKS)** – Managed Kubernetes alternative to K3s
  - [ ] **Azure Container Registry (ACR)** – For storing Docker images
  - [ ] **Azure DevOps Pipelines** – CI/CD alternative to GitHub Actions
  - [ ] **Azure App Service** – App hosting without full Kubernetes
  - [ ] **Azure Functions** – Serverless background processing
  - [ ] **Infrastructure as Code (IaC)**: Azure Resource Manager (ARM) · Terraform · Bicep

---

### 🧠 Platform Technology Overview In Detail

Below is a very detailed overview of the technologies powering the platform and its apps.

<details>
<summary><strong>🧱 Core Infrastructure</strong></summary>

- **OS:** Ubuntu (Linux)
- **Servers:** VPS (Hetzner)
- **Static Web Server:** NGINX
- **Authentication Server:** Keycloak
- **Database:** PostgreSQL · pgAdmin 4
- **File Storage:** Cloudflare R2
- **Domains & DNS:** Cloudflare
- **Payments** Stripe

</details>

<details>
<summary><strong>🚀 Containerization & DevOps</strong></summary>

- **Docker:** Docker Compose · Docker Desktop · Docker Hub · Dockerfiles · Multi-stage images
- **Kubernetes:** K3s · k3d · kubectl · Deployments · Services · Secrets · ConfigMaps · Ingress · TLS Certs · NGINX Ingress Controller · ServiceLB
- **GitOps:** Argo CD · Kustomize · Argo CD Image Updater (staging)
- **Package Management:** Helm
- **CI/CD:** GitHub Actions · `nx affected` · staging & production workflows · lint/test/build/deploy phases
- **Shell Scripts:** `wait-for-postgres.sh` · `entrypoint.sh`

</details>

<details>
<summary><strong>📈 Observability</strong></summary>

- **Monitoring:** Prometheus · Grafana
- **Logging:** Loki · Promtail

</details>

<details>
<summary><strong>🔍 AI & Search</strong></summary>

- **Search Engine:** Meilisearch
- **AI Models:** OpenAI GPT-4o-mini (function calling for search filters)

</details>

<details>
<summary><strong>🧰 Monorepo & Tooling</strong></summary>

- **Monorepo Manager:** Nx
  - Apps and modular libraries (`feature`, `ui`, `data-access`, `util`)
  - Nx Generators · `nx affected` · layered architecture
  - Nx Cloud · remote caching
- **CI Runners:** Self-hosted GitHub Actions on VPS

</details>

<details>
<summary><strong>🧑‍💻 Frontend (Client)</strong></summary>

- **Languages & Tools:** TypeScript · pnpm
- **Frameworks:**
  - **Angular:** Standalone Components · RxJS · Signals · Interceptors · Guards · Reactive Forms
  - **React:** Micro UI as UMD bundle via Vite + Web Components
- **State & Data:** TanStack Query
- **UI & Styling:** Tailwind · SCSS · Carbon Design System · Angular Material · HTML · FontAwesome
- **Testing:** Vitest · Storybook · Playwright
- **Linting & Formatting:** ESLint · Prettier
- **Bundlers:** Vite · Webpack
- **Microfrontends:** Dynamic Module Federation · Web Components

</details>

<details>
<summary><strong>🔗 Backend (API)</strong></summary>

- **Languages:** C# · PHP · Python
- **Frameworks:**
  - **.NET:** Controllers · Services · DTOs · Middleware · Migrations · Fluent API · DbContext · Entities (Models)
  - **Laravel:** Models · Requests · Resources · Artisan CLI · Seeders · Factories · Commands · Controllers · Services
  - **FastAPI:** (used for utility APIs or AI controller)
  - **Messaging & Background:** MassTransit · RabbitMQ
- **Real-Time:** SignalR (WebSockets)
- **Package Managers:** NuGet · Composer
- **ORMs:** Entity Framework (EF) · Doctrine
- **Object Mapper:** AutoMapper
- **Testing:** xUnit · Moq · Postman
- **Formatting:** `dotnet format`
- **API Docs:** Scalar · Swagger

</details>

<details>
<summary><strong>🔐 Authentication</strong></summary>

- **Auth Server:** Keycloak
- **Client Integration:** `keycloak-js` · JWT · `firebase/php-jwt`

</details>

<details>
<summary><strong>📋 Project Management</strong></summary>

- **PM Tool:** Jira — used for sprint planning, backlog tracking, and task management

</details>
