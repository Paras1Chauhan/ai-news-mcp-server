# ---------- Build Stage ----------
FROM node:20 AS builder

WORKDIR /app

# Copy only package files first (layer caching)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-slim AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS from build stage (named stage)
COPY --from=builder /app/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Switch to non-root user
USER appuser

# Start server
CMD ["node", "dist/index.js"]