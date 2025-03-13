### 4.2 Staging & Production

#### 4.2.1 Dockerfiles

These are the Dockerfiles used in production for my client and API apps. The client Docker images just serve the built files provided by the pipeline. Staging has a similar setup.

I have **Dockerfiles** for

→ NGINX for serving Angular builds files

→ .NET SDK for .NET builds and ASP.NET as runtime

→ PHP-FPM for http request support + NGINX to serve Laravel build files

> **Note:** The C# API still has a multi-stage Dockerfile building the application and running the server. Even though Nx takes care of building in the pipeline already. I will have to see later what to do about this.

![Production Dockerfiles](./docs/devops/prod/dockerfiles.prod_v3.png)

#### 4.2.2 Architecture Diagram

[**V1: Three deployments: front, back and database**](./docs/devops/prod/environment-setup.prod_v1.png)
The very first model of the k3s platform cluster.

**V2: Six deployments**
This is my current production cluster. When the pipeline runs to deploy it's actually updating these deployments here (besides Postgres and Keycloak) with a brand new Docker image or it rolls back if that does not go as planned. To configure different domains, I had to add an A record to my settings at Cloudflare that point to the public IPv4 address of my VPS.

I have **deployments** for
→ Platform App
→ Admin App
→ Platform API
→ Webshop API

→ Postgres
→ Keycloak

![Production Setup Diagram](./docs/devops/prod/environment-setup.prod_v4.png)
