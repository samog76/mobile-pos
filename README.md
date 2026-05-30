# Mobile POS Polyglot Platform

This repository provides a minimal end-to-end **mobile POS fintech** monorepo using all requested stacks:

- Web: `apps/web-next` (Next.js) and `apps/web-react` (React/Vite)
- Mobile: `apps/mobile-flutter` and `apps/mobile-android`
- Services: `services/api-node`, `services/risk-python`, `services/ledger-java`
- Data: PostgreSQL + MongoDB
- Messaging: Kafka + Amazon SQS (LocalStack for local)
- Analytics: Google Analytics snippet (web) + ClickHouse local service
- Infra: Kubernetes manifests (`infra/k8s`) + Terraform AWS artifact (`infra/aws`)

## Local development

```bash
cd infra/docker
docker compose up
```

Core infra/services started: Postgres, MongoDB, Kafka/Zookeeper, ClickHouse, LocalStack(SQS), Node API, Python risk service, Java ledger service.

## Run web apps

```bash
cd apps/web-next && npm install && npm run dev
cd apps/web-react && npm install && npm run dev
```

## Run mobile apps

```bash
cd apps/mobile-flutter && flutter pub get && flutter run
cd apps/mobile-android && ./gradlew assembleDebug
```

## API gateway (Node)

```bash
cd services/api-node
cp .env.example .env
npm install
npm run dev
```

OpenAPI docs: `http://localhost:4000/docs`

Main endpoints:
- `POST /auth/login` (role can be `user` or `merchant`)
- `POST /merchants`, `POST /terminals`, `POST /products`
- `POST /sales` (Monnify/Verve adapter via `provider`)
- `POST /webhooks/:provider` (signature verification placeholder)

## Risk service (Python)

```bash
cd services/risk-python
pip install -r requirements.txt
uvicorn app:app --reload
```

## Ledger service (Java)

```bash
cd services/ledger-java
mvn spring-boot:run
```

Endpoints:
- `POST /ledger/transactions` (double-entry: debit+credit)
- `GET /ledger/balances/{account}`

## Environment and secrets
- Credentials are environment-driven; see `services/api-node/.env.example`.
- Do not commit real Monnify/Verve/API secrets.

## CI
GitHub Actions workflow at `.github/workflows/polyglot-ci.yml` runs web (Next.js/React), Node, Python, Java, Flutter, Android, and basic dependency security checks.
