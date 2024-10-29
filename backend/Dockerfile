# Use the official Node.js image as the base for building
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, and other necessary files
COPY package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies) for building
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code, including Prisma schema
COPY . .

# Build TypeScript files
RUN pnpm run build

# Generate the Prisma client with correct binary targets
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Use a lightweight final stage for serving the app
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Install pnpm globally in the production container
RUN npm install -g pnpm

# Copy built files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/src/prisma /app/src/prisma 

# Copy package.json and pnpm-lock.yaml to install runtime dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Expose the port and run the application
EXPOSE 9100
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && node dist/app.js"]
