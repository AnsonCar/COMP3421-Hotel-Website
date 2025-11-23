# Start

## start all service

```bash
docker compose up -d --build --force-recreate
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
