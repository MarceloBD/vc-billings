"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDatabase } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { getNextMonth } from "@/lib/month-helpers";

export async function getPaymentsByMonth(month: string) {
  const database = getDatabase();
  return database
    .select()
    .from(payments)
    .where(eq(payments.month, month))
    .orderBy(payments.dueDay);
}

export async function createPayment(formData: FormData) {
  const database = getDatabase();
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
  const database = getDatabase();
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
  const database = getDatabase();
  await database.delete(payments).where(eq(payments.id, paymentId));
  revalidatePath("/dashboard");
}

export async function togglePaymentPaid(paymentId: number, isPaid: boolean) {
  const database = getDatabase();
  await database
    .update(payments)
    .set({ isPaid, updatedAt: new Date() })
    .where(eq(payments.id, paymentId));

  revalidatePath("/dashboard");
}

export async function duplicateMonthPayments(
  sourceMonth: string
): Promise<{ success: boolean; message: string }> {
  const database = getDatabase();
  const targetMonth = getNextMonth(sourceMonth);

  const existingPayments = await database
    .select()
    .from(payments)
    .where(eq(payments.month, targetMonth));

  if (existingPayments.length > 0) {
    return {
      success: false,
      message: `${targetMonth} já possui ${existingPayments.length} pagamento(s). Exclua-os primeiro ou gerencie manualmente.`,
    };
  }

  const sourcePayments = await database
    .select()
    .from(payments)
    .where(eq(payments.month, sourceMonth));

  if (sourcePayments.length === 0) {
    return {
      success: false,
      message: "Nenhum pagamento encontrado neste mês para duplicar.",
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
    message: `${sourcePayments.length} pagamento(s) duplicado(s) para ${targetMonth}.`,
  };
}
