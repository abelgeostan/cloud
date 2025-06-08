# Build stage
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && ls -la /app/dist

# Production stage - serve static files
FROM node:slim
WORKDIR /app
COPY --from=build /app/dist ./dist  
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]