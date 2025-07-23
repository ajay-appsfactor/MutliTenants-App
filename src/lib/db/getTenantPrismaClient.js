import { PrismaClient } from "../../../prisma/generated/main"
import mainPrisma from './mainPrisma.js'


const tenantClients = {}

async function getTenantClient(subdomain) {
  if (tenantClients[subdomain]) {
    return tenantClients[subdomain]
  }

  const tenant = await mainPrisma.tenant.findUnique({
    where: { subdomain },
  })

  if (!tenant) throw new Error('Tenant not found')

  const client = new PrismaClient({
    datasources: {
      db: {
        url: tenant.db_url,
      },
    },
  })

  tenantClients[subdomain] = client
  return client
}

export default getTenantClient
