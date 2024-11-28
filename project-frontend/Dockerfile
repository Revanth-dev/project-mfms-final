# Use Node.js for building the frontend
FROM node:20 AS build

# Set working directory
WORKDIR /frontend

# Copy project files
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine
COPY --from=build /frontend/dist /usr/share/nginx/html

# Expose port for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
