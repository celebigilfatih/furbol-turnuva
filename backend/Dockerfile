FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 5004

ENV NODE_ENV production
ENV PORT 5004

CMD ["npm", "start"]