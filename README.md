# eDB

---

### 🌐 Access & Environments

Here's an overview of the key resources for this platform:

| Purpose                    | URL                                                                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🚧 Staging Environment     | [https://app.staging.eliasdebock.com](https://app.staging.eliasdebock.com)                                                                                                                               |
| 🚀 Production Environment  | [https://app.eliasdebock.com](https://app.eliasdebock.com)                                                                                                                                               |
| 📊 Monitoring & Logging    | [https://grafana.staging.eliasdebock.com](https://grafana.staging.eliasdebock.com)                                                                                                                       |
| 🧩 Scalar API Docs         | [https://api.staging.eliasdebock.com/platform/scalar](https://api.staging.eliasdebock.com/platform/scalar) \| [https://api.eliasdebock.com/platform/scalar](https://api.eliasdebock.com/platform/scalar) |
| 🐇 RabbitMQ Management UI  | [https://rabbitmq.staging.eliasdebock.com](https://rabbitmq.staging.eliasdebock.com) \| [https://rabbitmq.eliasdebock.com](https://rabbitmq.eliasdebock.com)                                             |
| 🧪 Nx Cloud Workspace      | [https://cloud.nx.app/orgs/6733ac554277bfac823c438a/workspaces](https://cloud.nx.app/orgs/6733ac554277bfac823c438a/workspaces)                                                                           |
| 🧾 Technical Documentation | [https://eliasdebock.com/nl/docs/eDB/getting-started/project-overview](https://eliasdebock.com/nl/docs/eDB/getting-started/project-overview)                                                             |
| 🗺️ Dependency Graph        | [https://eliasdebock.com/docs/dep-graph/graph#/projects/all](https://eliasdebock.com/docs/dep-graph/graph#/projects/all)                                                                                 |
| 📚 Storybook UI Library    | [https://eliasdebock.com/docs/storybook/index.html](https://eliasdebock.com/docs/storybook/index.html)                                                                                                   |
| 🐳 Docker Hub Repository   | [https://hub.docker.com/u/eliasdb](https://hub.docker.com/u/eliasdb)                                                                                                                                     |
| 🚦 Argo CD Dashboard       | [https://argocd.staging.eliasdebock.com](https://argocd.staging.eliasdebock.com)                                                                                                                         |

### TLDR docs

#### Project Goal

I'm building a modular platform that allows users to create an account, subscribe to various applications, and launch them from a central dashboard.

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

| Category             | Technology       |
| -------------------- | ---------------- |
| **Containerization** | Docker           |
| **Orchestration**    | K3s              |
| **CI/CD**            | GitHub Actions   |
| **Monitoring**       | Prometheus       |
|                      | Grafana          |
|                      | Loki · Promtrail |

---

##### 🧪 Testing & Build Tools

| Category              | Technology        |
| --------------------- | ----------------- |
| **Frontend Testing**  | Vitest            |
| **Backend Testing**   | xUnit · Postman   |
|                       | Moq               |
| **UI Component Dev**  | Storybook         |
| **API Documentation** | Scalar            |
| **Build Tooling**     | Vite (React)      |
|                       | Webpack (Angular) |

---

| Category                | Technology           |
| ----------------------- | -------------------- |
| **Message Broker**      | RabbitMQ             |
| **Service Messaging**   | MassTransit (.NET)   |
| **Real-Time Transport** | SignalR (WebSockets) |

---

### 🏁 Achieved Goals

#### 🐳 Infrastructure & Deployment

<details>
<summary><strong>Infrastructure Overview</strong></summary>

- **Containerizing applications:** Dockerfiles
- **Development environment:** K3s cluster using k3d + Skaffold or Nx + local Postgres
- **Staging environment:** K3s cluster on VPS
- **Production environment:** K3s cluster on VPS
- **CI/CD pipelines:** Pre-merge checks + post-merge deploy via self-hosted ARM GitHub Actions runner

</details>

---

#### 🖥️ Client

<details>
<summary><strong>Frontend Architecture</strong></summary>

- **Microfrontends:** Implemented using dynamic Module Federation and Web Components
- **Layered Modular Architecture:** Separated into apps and libs (feature, data-access, ui, util, etc.)

</details>

---

#### 🔐 Identity & Access

<details>
<summary><strong>Authentication</strong></summary>

- **Auth system:** Self-hosted Keycloak (login, registration, profile management, session handling, etc.)

</details>

---

#### 📨 Messaging & Real-Time

<details>
<summary><strong>Implemented</strong></summary>

- **Message Broker:** RabbitMQ
- **Service Messaging:** MassTransit (.NET) for async, resilient communication
- **Real-Time UI:** SignalR → live updates in Angular dashboard (orders, notifications)
</details>

---

#### 📚 Documentation

<details>
<summary><strong>Developer Docs</strong></summary>

- **Documentation:** Internal technical documentation is hosted and actively maintained

</details>

---

#### 📊 Monitoring & Observability

<details>
<summary><strong>Dashboards & Logs</strong></summary>

- **Stack:** Grafana · Prometheus · Loki · Promtail
- **Use:** Centralized logging, metrics, and platform-wide observability

</details>

---

### 🧠 Platform Technology Overview

Below is a categorized overview of the technologies powering the platform and its apps.

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
- **Kubernetes:** K3s · k3d · kubectl · Deployments · Services · Secrets · ConfigMaps · Ingress · TLS Certs · NGINX Ingress Controller
- **Package Management:** Helm
- **CI/CD:** GitHub Actions · `nx affected` · staging & production workflows · yaml linting · lint/test/build/deploy phases
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
- **Testing:** Vitest · Storybook
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

---

#### Tools I'm working towards using

**DevOps**

- [ ] **Secrets Management**: HashiCorp Vault · SealedSecrets · External Secrets Operator
- [ ] **Logging & Distributed Tracing/Search Engine**: ELK Stack (Elasticsearch · Logstash · Kibana)
- [ ] **Cluster Management**: ArgoCD (GitOps) · Helm · Kustomize
- [ ] **Hotfixes & Feature Flags**: Under evaluation
- [ ] **Load Balancing**: Ingress Controller or External LB support

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

**Client**

- [ ] **End-to-End Testing**: Cypress · Playwright
- [ ] **State Management**: NgRx · Akita · SignalStore
- [ ] **Error Handling & Monitoring**: Sentry · PostHog
- [ ] **Accessibility (a11y) Testing**: Axe DevTools · Lighthouse

---

**API**

- [ ] **Architecture**: Domain-Driven Design · Clean Architecture (incremental)
- [ ] **Background Jobs & Messaging**: Hangfire · MediatR · Kafka
- [ ] **Caching**: Redis (enable & add invalidation strategy)
- [ ] **Rate Limiting & API Gateway**: Ocelot · YARP · Envoy
- [ ] **Feature Flags & Config Management**: Unleash · ConfigCat

---

# EDB

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/f0ryEp2hXb)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve eDB
```

To create a production bundle:

```sh
npx nx build eDB
```

To see all available targets to run for a project, run:

```sh
npx nx show project eDB
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
