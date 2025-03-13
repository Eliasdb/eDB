### Staging & Production

#### Dockerfiles

These are the Dockerfiles used in production for my client and API apps. The client Docker images just serve the built files provided by the pipeline. Staging has a similar setup.

I have **Dockerfiles** for

| Service         | Purpose                             |
| --------------- | ----------------------------------- |
| NGINX           | Serves Angular build files          |
| .NET SDK        | Used for building .NET applications |
| ASP.NET Runtime | Runs .NET applications              |
| PHP-FPM         | Handles HTTP requests for Laravel   |
| NGINX           | Serves Laravel build files          |

> **Note:** The C# API still has a multi-stage Dockerfile building the application and running the server. Even though Nx takes care of building in the pipeline already. I will have to see later what to do about this.

![Production Dockerfiles](./devops/prod/dockerfiles.prod_v3.png)

#### Architecture Diagram

[**V1: Three deployments: front, back and database**](./devops/prod/environment-setup.prod_v1.png)
The very first model of the k3s platform cluster.

**V2: Six deployments**

| Category     | Services/Apps                 |
| ------------ | ----------------------------- |
| **Client**   | ✅ Platform App - Admin App   |
| **API**      | ✅ Platform API - Webshop API |
| **Database** | ✅ PostgreSQL                 |
| **Auth**     | ✅ Keycloak                   |

This is my current production cluster. When the pipeline runs to deploy it's actually updating these deployments here (besides Postgres and Keycloak) with a brand new Docker image or it rolls back if that does not go as planned. To configure different domains, I had to add an A record to my settings at Cloudflare that point to the public IPv4 address of my VPS.

![Production Setup Diagram](./devops/prod/environment-setup.prod_v4.png)
