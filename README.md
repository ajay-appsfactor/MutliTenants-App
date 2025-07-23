```bash
npx prisma migrate dev --name init --schema=prisma/schema.main.prisma
npx prisma generate --schema=prisma/schema.main.prisma
npx prisma db push --schema=prisma/schema.main.prisma
npx prisma studio --schema=prisma/schema.main.prisma
```