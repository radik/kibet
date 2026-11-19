# Development/tooling image. All npm and node commands for this site run in
# here, never on the host: third-party packages only ever execute in the
# container. Production is static files built in CI, not this image.
FROM node:22-bookworm-slim

ENV ASTRO_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    npm_config_cache=/home/node/.npm

# Pre-create the volume mount points owned by the unprivileged user, so the
# named volumes inherit that ownership on first use.
RUN mkdir -p /app/node_modules /home/node/.npm \
 && chown -R node:node /app /home/node/.npm

WORKDIR /app
USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
