import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, useDatabase, prismaCaseToCaseItem, caseItemPartialToPrismaUpdate } from "@/lib/db";
import type { CaseItem } from "@/types/crm";

export const dynamic = "force-dynamic";

/** GET /api/cases/[id] — get one case */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!useDatabase() || !prisma) {
    return NextResponse.json(
      { error: "Database not configured; use mock data." },
      { status: 503 }
    );
  }
  const id = (await params).id;
  try {
    const row = await prisma.case.findUnique({ where: { id } });
    if (!row) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(prismaCaseToCaseItem(row));
  } catch (e) {
    console.error("GET /api/cases/[id]", e);
    return NextResponse.json({ error: "Failed to get case" }, { status: 500 });
  }
}

/** PATCH /api/cases/[id] — update a case */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!useDatabase() || !prisma) {
    return NextResponse.json(
      { error: "Database not configured; use mock data." },
      { status: 503 }
    );
  }
  const id = (await params).id;
  try {
    const body = (await request.json()) as Partial<CaseItem>;
    const payload = body ? caseItemPartialToPrismaUpdate(body) : {};
    if (Object.keys(payload).length === 0) {
      const row = await prisma.case.findUnique({ where: { id } });
      if (!row) return NextResponse.json(null, { status: 404 });
      return NextResponse.json(prismaCaseToCaseItem(row));
    }
    const updated = await prisma.case.update({
      where: { id },
      data: payload as Prisma.CaseUpdateInput,
    });
    return NextResponse.json(prismaCaseToCaseItem(updated));
  } catch (e) {
    console.error("PATCH /api/cases/[id]", e);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }
}

/** DELETE /api/cases/[id] — delete a case */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!useDatabase() || !prisma) {
    return NextResponse.json(
      { error: "Database not configured; use mock data." },
      { status: 503 }
    );
  }
  const id = (await params).id;
  try {
    await prisma.case.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/cases/[id]", e);
    return NextResponse.json({ error: "Failed to delete case" }, { status: 500 });
  }
}
