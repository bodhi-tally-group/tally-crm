import { NextResponse } from "next/server";
import { prisma, useDatabase, prismaCaseToCaseItem, caseItemToPrismaPayload } from "@/lib/db";
import type { CaseItem } from "@/types/crm";

export const dynamic = "force-dynamic";

/** GET /api/cases — list all cases, or ?caseNumber=X for one by number */
export async function GET(request: Request) {
  if (!useDatabase() || !prisma) {
    return NextResponse.json(
      { error: "Database not configured; use mock data." },
      { status: 503 }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const caseNumber = searchParams.get("caseNumber");
    const rows = caseNumber
      ? await prisma.case.findMany({ where: { caseNumber }, take: 1 })
      : await prisma.case.findMany({ orderBy: { updatedAt: "desc" } });
    const cases: CaseItem[] = rows.map(prismaCaseToCaseItem);
    return NextResponse.json(cases);
  } catch (e) {
    console.error("GET /api/cases", e);
    return NextResponse.json({ error: "Failed to list cases" }, { status: 500 });
  }
}

/** POST /api/cases — create a case */
export async function POST(request: Request) {
  if (!useDatabase() || !prisma) {
    return NextResponse.json(
      { error: "Database not configured; use mock data." },
      { status: 503 }
    );
  }
  try {
    const body = (await request.json()) as CaseItem;
    const payload = caseItemToPrismaPayload(body);
    const created = await prisma.case.create({
      data: payload,
    });
    return NextResponse.json(prismaCaseToCaseItem(created));
  } catch (e) {
    console.error("POST /api/cases", e);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
