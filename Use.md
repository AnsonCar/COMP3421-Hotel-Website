# Start

## start all service

```bash
docker compose up -d --build
```

## init test data

```bash
cd backend
```

```bash
npm run db:testdata
```

## test frontend

```bash
cd cypress
```

```bash
npm run test
```
