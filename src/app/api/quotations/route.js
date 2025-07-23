import getTenantClient from "@/lib/db/getTenantPrismaClient"

export async function GET(req) {
  const host = req.headers.get("host")
  const subdomain = host.split(".")[0]

  const prisma = await getTenantClient(subdomain)

  const quotations = await prisma.quotation.findMany({
    orderBy: { created_at: "desc" },
  })

  return Response.json(quotations)
}

export async function POST(req) {
  const host = req.headers.get("host")
  const subdomain = host.split(".")[0]
  const prisma = await getTenantClient(subdomain)

  const body = await req.json()

  const created = await prisma.quotation.create({
    data: {
      title: body.title,
      amount: parseFloat(body.amount),
      status: body.status || "Draft",
    },
  })

  return Response.json(created)
}
