# Full Stack Application with Docker and Kubernetes

## Project Overview

This project aims to create a full stack application with a frontend, backend, and database, each running in its own Docker container. The primary goal is to learn and implement Docker and Kubernetes to manage the application environment effectively, both for development and production.

### Current Progress

-   **Frontend**: Built with Vue.js, running in its own container.
-   **Backend**: Developed using Node.js, TypeScript, and Express, with Prisma for database management, JWT for authentication, and bcrypt for secure password handling.
-   **Database**: MySQL database running in a separate container.

### Development and Production Environments

-   **Development**:

    -   Uses `docker-compose.dev.yml` for setting up services with hot-reloading and easy debugging.
    -   Containers can be started with:
        ```bash
        docker-compose -f docker-compose.dev.yml up --build
        ```

-   **Production**:
    -   Uses `docker-compose.prod.yml` for running optimized and production-ready containers.
    -   Containers can be started with:
        ```bash
        docker-compose -f docker-compose.prod.yml up --build
        ```

### Infrastructure

-   **Docker**: Containerization platform to run the frontend, backend, and database in separate containers.
-   **Docker Compose**: Tool for defining and running multi-container Docker applications.
-   **Kubernetes**: Container orchestration platform for managing containerized applications.

### Current Goals

1. **Kubernetes Exploration**:
    - Set up a local Kubernetes cluster for managing the Docker containers.
    - Utilize tools such as Minikube to test Kubernetes locally.
2. **Deploy to Production**:
    - Deploy the Kubernetes cluster to a production environment with minimal or no cost.
