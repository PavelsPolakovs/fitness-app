.PHONY: help install start start-android start-ios lint lint-fix format format-check typecheck test test-watch check-all ci clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install --legacy-peer-deps

start: ## Start Expo dev server
	npm run start

start-android: ## Start Expo on Android
	npm run android

start-ios: ## Start Expo on iOS
	npm run ios

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint and fix issues
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check formatting with Prettier
	npm run format:check

typecheck: ## Run TypeScript type check
	npm run typecheck

test: ## Run tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

check-all: lint format-check typecheck test ## Run lint + format-check + typecheck + test

ci: ## Run CI locally via act
	act push

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules .expo dist