```bash
npx prisma migrate dev --name init --schema=prisma/schema.main.prisma
npx prisma generate --schema=prisma/schema.main.prisma
npx prisma db push --schema=prisma/schema.main.prisma
npx prisma studio --schema=prisma/schema.main.prisma
```

```bash
| Role             | Feature                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Super Admin**  | - Tenants ka creation <br> - Tenants ka list <br> - Settings                              |
| **Tenant Users** | - Apna data access karein (projects, quotes, items, etc.) <br> - Apne users manage karein |


```