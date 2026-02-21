import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { payments } from "@/lib/db/schema";

export async function GET() {

  const database = getDatabase();
  await database.delete(payments);

  return NextResponse.json({
    success: true,
  });
}
