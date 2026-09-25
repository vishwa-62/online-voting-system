# Multi-stage Docker build for Online Voting System
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
COPY database/ ./database/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Serve static frontend from Express server in production container mode if desired
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
