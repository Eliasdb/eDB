# 🛠️ Keycloak 26.x – Manual Setup Guide (No Docker)

This guide explains how to manually install and run Keycloak 26.x using the Quarkus distribution, including how to reliably bootstrap the admin user.

---

## 📦 Download & Extract

```bash
cd ~/Downloads
curl -L https://github.com/keycloak/keycloak/releases/download/26.1.3/keycloak-26.1.3.tar.gz -o keycloak.tar.gz
tar -xzf keycloak.tar.gz
cd keycloak-26.1.3
```

---

## 🚀 Start Keycloak with Admin User

Keycloak 26+ requires environment variables to create the admin user **on first startup only**:

```bash
KC_BOOTSTRAP_ADMIN_USERNAME=admin \
KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
bin/kc.sh start-dev
```

Then open: [http://localhost:8080](http://localhost:8080)

Login:

-   Username: `admin`
-   Password: `admin`

---

## ❌ Broken Console (e.g. custom theme issue)

If the admin console is stuck on loading or throwing React errors:

🧼 **The solution is to reinstall Keycloak:**

```bash
# Optional: backup your current folder
mv keycloak-26.1.3 keycloak-broken

# Download & extract again
cd ~/Downloads
curl -L https://github.com/keycloak/keycloak/releases/download/26.1.3/keycloak-26.1.3.tar.gz -o keycloak.tar.gz
tar -xzf keycloak.tar.gz
cd keycloak-26.1.3
```

Then re-run:

```bash
KC_BOOTSTRAP_ADMIN_USERNAME=admin \
KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
bin/kc.sh start-dev
```

---

## 📁 Folder Structure Overview

```
keycloak-26.1.3/
├── bin/                  # Startup scripts (kc.sh)
├── conf/                 # Config files (keycloak.conf)
├── data/                 # H2 DB data (can be ignored if reinstalling)
├── lib/                  # Java dependencies
├── themes/               # Custom themes (be careful!)
```

---

## 🧠 Notes

-   Do **not** use `--admin` or `--password` CLI flags — those are deprecated.
-   Only use `KC_BOOTSTRAP_ADMIN_USERNAME` + `KC_BOOTSTRAP_ADMIN_PASSWORD` on a clean install.
-   A broken custom `admin-theme` can prevent the admin console from loading — reinstall to recover.
-   For production:
    -   Use an external database like PostgreSQL.
    -   Disable dev mode (`start` instead of `start-dev`).
    -   Use `keycloak.conf` for persistent config.
