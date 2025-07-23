import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import mainPrisma from "@/lib/db/mainPrisma";
// import 'dotenv/config';

const execAsync = promisify(exec);

// GET: List all tenants
export async function GET() {
  try {
    const tenants = await mainPrisma.tenant.findMany({
      orderBy: { created_at: "desc" },
    });

    // console.log("Data Log :",tenants);

    return Response.json({ success: true, tenants });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch tenants",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

//  POST: Create tenant
export async function POST(req) {
  try {
    const { name, subdomain } = await req.json();

    //  Check if subdomain already exists
    const existing = await mainPrisma.tenant.findUnique({
      where: { subdomain },
    });

    if (existing) {
      return Response.json(
        {
          success: false,
          message: `Subdomain '${subdomain}' is already taken.`,
        },
        { status: 400 }
      );
    }

    const shortId = randomUUID().slice(0, 6);
    const dbName = `tenant_${subdomain}_${shortId}`;

        // Read from .env
    const baseUrl = process.env.TENANT_DB_BASE_URL;
    const superDbUrl = process.env.DATABASE_URL;


    const dbUrl = `${baseUrl}/${dbName}`;

    //  Step 1: Create DB
    const adminPrisma = new mainPrisma.constructor({
      datasources: {
        db: {
          url: `${superDbUrl}`,
        },
      },
    });

    await adminPrisma.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
    await adminPrisma.$disconnect();

    // Step 2: Run tenant migrations
    await execAsync(
      `npx cross-env DATABASE_URL="${dbUrl}" npx prisma migrate deploy --schema=prisma/schema.main.prisma`
    );

    //  Step 3: Save tenant
    const newTenant = await mainPrisma.tenant.create({
      data: { name, subdomain, db_url: dbUrl },
    });

    return Response.json({
      success: true,
      message: "Tenant created successfully",
      tenant: newTenant,
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create tenant",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
