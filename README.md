# map-it
Roadmap tool.

# Run locally
- Have [Docker](https://docs.docker.com/install/) installed
- Run `docker-compose up`

# Test

- Local DB
  - Install PostgreSQL
  - Create database `map-it-test`
- DB in Docker
  - `docker pull postgres:11`
  - `docker run --name pg-docker-map-it-test -e POSTGRES_DB=map-it-test -p 5432:5432 postgres:11`

- `npm run test-local` or `npm run test-watch`
