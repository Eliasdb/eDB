-- Runs once on first boot (empty data dir). No conditionals needed.

-- Webshop
CREATE ROLE webshop_user LOGIN PASSWORD 'supersecure';
CREATE DATABASE webshop_dev OWNER webshop_user;

-- Platform
CREATE ROLE elias LOGIN PASSWORD 'mypassword';
CREATE DATABASE mydatabase OWNER elias;

-- Extensions
\connect webshop_dev
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect mydatabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
