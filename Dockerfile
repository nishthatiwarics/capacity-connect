# ------------------------------------------------------------------------------
# Multi-Stage Dockerfile for Capacity Connect — IMD Training Portal
# Production-ready, secure, lightweight Node & Nginx containerization
# Complies with Port 3000 container ingress standards
# ------------------------------------------------------------------------------

# Stage 1: Build the React + Vite Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for compilation
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration listening strictly on Port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Metadata labels
LABEL maintainer="Team Necto_404 <moes.imd.capacityconnect@gov.in>"
LABEL description="Capacity Connect — IMD Training Portal (SIH26075)"
LABEL version="1.0.0"

# Expose Port 3000 (Required container port)
EXPOSE 3000

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
