### Client

### Stack & Architecture

#### Stack

-   **Framework**: Angular 19
-   **Unit Testing**: Vitest
-   **UI**: Carbon Design System - Angular Material
-   **Linting**: ESLint
-   **Code Formatting**: **Prettier**
-   **Component Documentation**: **Storybook 8**
-   **API Integration**: **TanStack Query** for efficient data fetching and state management with the backend REST API.

#### Architecture

The application follows a **Layered Modular Architecture** in Nx, designed for flexibility and maintainability. Each layer has a distinct role, enforcing strict dependency rules to keep the system modular.

### Pages

#### Keycloak

This server replaces my old custom made login, register and profile overview page. Which I have archived since switching to Keycloak.

[Login page](https://app.eliasdebock.com)
[Register page](https://app.eliasdebock.com)
[Profile page](https://app.eliasdebock.com/keycloak/realms/EDB%PROD/account)

#### Platform App

-   [x] [Catalog](https://app.eliasdebock.com/catalog) → Browse available applications
-   [x] [Dashboard](https://app.eliasdebock.com) → Dashboard to manage and launch subscribed applications
-   [x] [404](https://app.eliasdebock.com/not-found) → For routes that are not found

[**#1 Webshop App**](https://app.eliasdebock.com/webshop/catalog)

-   [x] Overview of books with search, filtering, scroll-based pagination and sort
-   [x] Cart
-   [x] Single book page
-   [x] Order overview customer

#### Admin App

-   [x] [Admin dashboard](https://app.eliasdebock.com/admin/dashboard)
        → To manage applications and user subscriptions.
        → To manage items and orders in webshop.

### Layers of Modular Architecture

##### 1. Application Layer (Apps) 🏛

-   Contains **root-level orchestration** (e.g., routing).
-   Does **not** contain feature logic but instead delegates to feature modules.
-   Directly interacts only with the **Feature Layer**.

##### 2. Feature Layer (Feature Libs) 📦

-   Implements **business logic** for different pages (e.g., Dashboard, Profile, Appointments).
-   Depends on **UI components** for presentation and **Data-Access** for API communication.
-   Features are **structured as pages**, ensuring modularity within the platform.

##### 3. UI/Presentation Layer (UI Libs) 🎨

-   Houses **reusable UI components** shared across pages.
-   Focuses purely on **presentation**, without business or data-fetching logic.
-   Built with **Storybook 8** for documentation and design consistency.
-   Built using **Carbon Design System**.

##### 4. Data-Access Layer (Client Libs) 🔄

-   Handles **API communication, caching, and state management** using **TanStack Query**.
-   Provides an abstraction over direct API calls, making feature modules independent of API changes.
-   Ensures a **clean separation** between UI and backend interactions.

##### 5. Utility & Shared Layer (Utils, Shared-Env, etc.) 🔧

-   Contains **cross-cutting utilities**, such as environment configurations, constants, and helper functions.
-   Keeps global concerns separate from features, ensuring **clean code structure**.

##### Why This Structure? 🚀

This **modular and scalable structure** ensures:

-   **Decoupling of concerns**, improving maintainability and testability.
-   **Optimized builds**, as changes in one layer do not trigger unnecessary rebuilds.
-   **Easier feature expansion**, allowing new pages to be added without affecting existing ones.

By following **Layered Modular Architecture**, the system remains **scalable, testable, and maintainable** over time. That is the goal at least...

### Architecture Diagrams

[**V1: Monolithic Platform App**](./frontend/frontend-architecture_v5.png)
The first model of the platform using a familiar monolithic approach.

[**V2: Layered Modular Platform App and Admin App**](./frontend/frontend-architecture_v6.png)
This is a first attempt at more layered modular approach. I split up my pages and services into reusable and independently testable libraries. This refactor tries to follow best practices for Nx Workspaces. Tried to abstract these libraries into layers in my mental model of this trying to learn more about architecture. To learn more check out their [documentation](https://nx.dev/concepts/decisions).

**V3: Layered Modular Platform App, Admin App & Webshop App**
![Layered Modular Platform App, Admin App & Webshop App](./frontend/frontend-architecture_v7.png)
