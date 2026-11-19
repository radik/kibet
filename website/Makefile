# All Node tooling runs inside Docker. Do not run npm on the host.
RUN := docker compose run --rm web

.PHONY: install build check lint format format-check i18n audit verify dev shell clean

install:        ## Install dependencies from the lockfile (into a Docker volume)
	$(RUN) npm ci

build:          ## Build the static site into dist/
	$(RUN) npm run build

check:          ## Type-check
	$(RUN) npm run check

lint:
	$(RUN) npm run lint

format:
	$(RUN) npm run format

format-check:
	$(RUN) npm run format:check

i18n:           ## List translation keys still falling back to English
	$(RUN) node src/i18n/missing-keys.ts

audit:          ## Known vulnerabilities in dependencies
	$(RUN) npm audit

verify: format-check lint check build   ## Everything CI runs

dev:            ## Dev server on http://localhost:4321
	docker compose up web

shell:
	$(RUN) bash

clean:          ## Remove containers and the node_modules / npm cache volumes
	docker compose down --volumes
