# --- Build stage: install dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- Runtime stage: minimal final image ---
FROM node:20-alpine
WORKDIR /app

# Run as a non-root user (security best practice covered in Week 3 of the syllabus)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Data directory for the JSON store (mounted as a volume in production if you
# want data to survive container restarts — see the deployment guide)
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Docker-level health check — mirrors what the ALB target group checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
