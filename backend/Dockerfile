### FRONTEND BUILD STAGE
FROM node:18 AS frontend

# Set working directory for frontend
WORKDIR /app/frontend

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy only necessary files first (for better caching)
COPY ../frontend/package*.json ./
RUN npm install

# Now copy the rest of the frontend code and build it
COPY ../frontend ./
RUN npm run build

### BACKEND STAGE
FROM node:18

# Set working directory for backend
WORKDIR /app

# Copy backend package files and install
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/ .

# Copy built frontend into backend's public folder
COPY --from=frontend /app/frontend/build ./public

# Expose backend port
EXPOSE 5000

ARG FRONTEND_URL
ARG PORT
ARG MONGODB_ATLAS_URI

ENV FRONTEND_URL=$FRONTEND_URL
ENV PORT=$PORT
ENV MONGODB_ATLAS_URI=$MONGODB_ATLAS_URI

# Start backend server
CMD [ "node", "index.js" ]
