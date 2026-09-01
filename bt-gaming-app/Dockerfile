# Stage 1: Build the Vuetify static assets
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config fallback for Vue Router (HTML5 History Mode)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# If using Vue Router with HTML5 history mode, add a basic nginx config override or use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]