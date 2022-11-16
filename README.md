## Initial install

```bash
$ cd packages/app-routes && npm run build
$ cd ../monorepo-ts-shared && npm run build
$ cd ../../ && npm run lerna
$ npm run envgen
$ docker-compose up
```

## Open a new bash and run each service indivicually

```bash
$ cd service/auth-service/prisma && npx prisma generate && npx prisma db push
$ cd service/o-auth-service/prisma && npx prisma generate && npx prisma db push

```

## Create new service

```bash
# give services directory and service name ./<<services-dir>>/<<service-name>>
$ npm run service:create -- ./services/new-example-service
$ npm run lerna

```
