# ============================================================================
# Vigyanics production image (Railway / Docker)
#
# Build args (required):
#   SUPABASE_URL      - your Supabase project URL (public)
#   SUPABASE_ANON_KEY - your Supabase anon key (public)
#
# Runtime env vars (set in Railway):
#   PORT                 - Railway injects this automatically
#   SUPABASE_URL
#   SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   JWT_SECRET
# ============================================================================

FROM node:20-slim AS build
WORKDIR /app

# Railway supplies service variables to Docker builds as build arguments.
# These two public values are embedded into the Vite browser bundles.
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Keep the package manager aligned with the committed lockfile format.
RUN npm install -g pnpm@10.33.0

# Copy workspace manifests first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/vigyanics/package.json artifacts/vigyanics/
COPY artifacts/admin/package.json artifacts/admin/
COPY lib/api-client-react/package.json lib/api-client-react/
COPY lib/api-spec/package.json lib/api-spec/
COPY lib/api-zod/package.json lib/api-zod/
COPY lib/db/package.json lib/db/
COPY scripts/package.json scripts/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# Copy source files
COPY tsconfig.base.json tsconfig.json ./
COPY artifacts/ artifacts/
COPY lib/ lib/
COPY scripts/ scripts/
COPY attached_assets/ attached_assets/

# Build the API server (bundles workspace deps with esbuild)
RUN cd artifacts/api-server && pnpm build

# Build the store frontend (public Supabase vars are baked in at build time)
RUN cd artifacts/vigyanics \
  && BASE_PATH=/ PORT=5100 \
     SUPABASE_URL=${SUPABASE_URL} SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \
     pnpm build

# Build the admin panel (served under /admin/)
RUN cd artifacts/admin \
  && BASE_PATH=/admin/ PORT=5200 \
     SUPABASE_URL=${SUPABASE_URL} SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \
     pnpm build

# ----------------------------------------------------------------------------
# Runtime stage
# ----------------------------------------------------------------------------
FROM node:20-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

# Copy the compiled artefacts and the production server
COPY --from=build /app/artifacts/api-server/dist artifacts/api-server/dist
COPY --from=build /app/artifacts/vigyanics/dist/public artifacts/vigyanics/dist/public
COPY --from=build /app/artifacts/admin/dist/public artifacts/admin/dist/public
COPY server.mjs ./

# The API bundle externalises a few packages; keep node_modules available.
COPY --from=build /app/node_modules ./node_modules

# Non-root user for better security
USER node

EXPOSE 8080

CMD ["node", "server.mjs"]
