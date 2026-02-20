"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { database } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { getNextMonth } from "@/lib/month-helpers";

export async function getPaymentsByMonth(month: string) {
  return database
    .select()
    .from(payments)
    .where(eq(payments.month, month))
    .orderBy(payments.dueDay);
}

export async function createPayment(formData: FormData) {
  const description = formData.get("description") as string;
  const amount = formData.get("amount") as string;
  const dueDay = parseInt(formData.get("dueDay") as string, 10);
  const month = formData.get("month") as string;
  const category = (formData.get("category") as string) || null;

  await database.insert(payments).values({
    description,
    amount,
    dueDay,
    month,
    category,
    isPaid: false,
  });

  revalidatePath("/dashboard");
}

export async function updatePayment(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10);
  const description = formData.get("description") as string;
  const amount = formData.get("amount") as string;
  const dueDay = parseInt(formData.get("dueDay") as string, 10);
  const category = (formData.get("category") as string) || null;

  await database
    .update(payments)
    .set({
      description,
      amount,
      dueDay,
      category,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id));

  revalidatePath("/dashboard");
}

export async function deletePayment(paymentId: number) {
  await database.delete(payments).where(eq(payments.id, paymentId));
  revalidatePath("/dashboard");
}

export async function togglePaymentPaid(paymentId: number, isPaid: boolean) {
  await database
    .update(payments)
    .set({ isPaid, updatedAt: new Date() })
    .where(eq(payments.id, paymentId));

  revalidatePath("/dashboard");
}

export async function duplicateMonthPayments(
  sourceMonth: string
): Promise<{ success: boolean; message: string }> {
  const targetMonth = getNextMonth(sourceMonth);

  const existingPayments = await database
    .select()
    .from(payments)
    .where(eq(payments.month, targetMonth));

  if (existingPayments.length > 0) {
    return {
      success: false,
      message: `${targetMonth} already has ${existingPayments.length} payment(s). Delete them first or manage them manually.`,
    };
  }

  const sourcePayments = await database
    .select()
    .from(payments)
    .where(eq(payments.month, sourceMonth));

  if (sourcePayments.length === 0) {
    return {
      success: false,
      message: "No payments found in the current month to duplicate.",
    };
  }

  const newPayments = sourcePayments.map(
    ({ description, amount, dueDay, category }) => ({
      description,
      amount,
      dueDay,
      month: targetMonth,
      category,
      isPaid: false,
    })
  );

  await database.insert(payments).values(newPayments);

  revalidatePath("/dashboard");
  return {
    success: true,
    message: `${sourcePayments.length} payment(s) duplicated to ${targetMonth}.`,
  };
}
