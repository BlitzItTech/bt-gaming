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

# If using Vue Router with HTML5 history mode, add a basic nginx config override or use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]