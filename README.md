# Full Stack Application with Docker and Kubernetes

## Project Overview

This project aims to create a full stack application with a frontend, backend, and database, each running in its own Docker container. The primary goal is to learn and implement Docker and Kubernetes to manage the application environment effectively, both for development and production.

### Current Setup

-   **Frontend**: Vue
-   **Backend**:
    -   Node.js
    -   TypeScript
    -   Express
    -   Prisma
    -   JWT
    -   nodemon
    -   bcryptjs
-   **Database**: MySQL

### Development and Production Environments

-   **Development**:

    -   **Docker Compose**:

        -   Uses `docker-compose.dev.yml` for setting up services with hot-reloading and easy debugging.
        -   Containers can be started with:
            ```bash
            docker-compose -f docker-compose.dev.yml up --build
            ```

    -   **Kubernetes with K3s and Skaffold**:

        -   K3s is utilized to create a lightweight Kubernetes cluster for local development and testing.
        -   **Create a K3d Cluster** with LoadBalancer ports:
            ```bash
            k3d cluster create mycluster --port "8080:8080@loadbalancer" --port "9100:9100@loadbalancer"
            ```
        -   **Start the K3d Cluster** (if it was previously created):

            ```bash
            k3d cluster start mycluster
            ```

        -   **Continuous Development with Skaffold**:

            -   Skaffold helps with continuous development and deployment to the K3s cluster.
            -   Create a `skaffold.yaml` file in your project root with the necessary configuration for your services, ensuring you define LoadBalancer types for services that require external access.
            -   Start the Skaffold process with:
                ```bash
                skaffold dev
                ```
            -   This command will build your Docker images, deploy your application to the K3s cluster, and watch for changes to automatically redeploy.

        -   **Accessing Your Services**:
            -   After deploying with Skaffold, access your frontend and backend services via the ports specified in your Kubernetes manifests. If you are using LoadBalancer type services, check the external IPs with:
                ```bash
                kubectl get services
                ```
            -   Use the obtained IP addresses and ports to access your applications in a web browser or API client.

-   **Production**:
    -   Uses `docker-compose.prod.yml` for running optimized and production-ready containers.
    -   Containers can be started with:
        ```bash
        docker-compose -f docker-compose.prod.yml up --build
        ```

### Infrastructure

-   **Docker**: Containerization platform to run the frontend, backend, and database in separate containers.
-   **Docker Compose**: Tool for defining and running multi-container Docker applications.
-   **Kubernetes (K3s)**: Lightweight container orchestration platform for managing containerized applications.
    -   **kubectl**: Command-line tool for interacting with Kubernetes clusters.
    -   **Kompose**: Tool for converting Docker Compose files to Kubernetes resource manifests.
    -   **K3d**: Tool for creating and managing K3s clusters in Docker.
    -   **Skaffold**: Tool for continuous development and deployment of applications to Kubernetes.

### Current Goals

1. **Docker Compose Setup**:

    - [x] Create and configure `docker-compose.dev.yml` for local development with hot-reloading.
    - [x] Create and configure `docker-compose.prod.yml` for production-ready containers.
    - [x] Test the Docker Compose setup to ensure all services are running correctly.

2. **Kubernetes Exploration**:

    - [x] Set up a local Kubernetes cluster with K3s for managing the Docker containers.
    - [x] Utilize K3d to create and manage the K3s cluster.
    - [x] Deploy applications to the K3s cluster using Skaffold.

3. **Deploy to Production**:

    - [ ] Deploy the Kubernetes cluster to a production environment with minimal or no cost.

4. **CI/CD**:
    - [ ] Integrate CI/CD pipelines for continuous deployment.
