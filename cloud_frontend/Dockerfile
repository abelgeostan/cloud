# Build stage
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage - serve directly without Nginx
FROM node:slim
WORKDIR /app
COPY --from=build /app/build ./build
COPY package*.json ./
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]