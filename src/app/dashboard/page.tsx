import { Suspense } from "react";
import { Header } from "@/components/header";
import { SummaryBar } from "@/components/summary-bar";
import { MonthSelector } from "@/components/month-selector";
import { PaymentList } from "@/components/payment-list";
import { DuplicateMonth } from "@/components/duplicate-month";
import { getPaymentsByMonth } from "@/actions/payment-actions";
import { getCurrentMonth } from "@/lib/month-helpers";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { month } = await searchParams;
  const currentMonth = month ?? getCurrentMonth();
  const payments = await getPaymentsByMonth(currentMonth);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <MonthSelector currentMonth={currentMonth} />
          </Suspense>
          <DuplicateMonth
            currentMonth={currentMonth}
            hasPayments={payments.length > 0}
          />
        </div>

        <SummaryBar payments={payments} />

        <PaymentList payments={payments} currentMonth={currentMonth} />
      </main>
    </div>
  );
}
