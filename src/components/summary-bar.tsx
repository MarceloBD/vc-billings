import { DollarSign, CheckCircle2, Clock } from "lucide-react";
import type { Payment } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/month-helpers";

interface SummaryBarProps {
  payments: Payment[];
}

export function SummaryBar({ payments }: SummaryBarProps) {
  const totalAmount = payments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount),
    0
  );
  const paidAmount = payments
    .filter((payment) => payment.isPaid)
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = payments.filter((payment) => payment.isPaid).length;
  const progressPercentage =
    payments.length > 0 ? (paidCount / payments.length) * 100 : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryCard
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        label="Total"
        value={formatCurrency(totalAmount)}
        backgroundClass="bg-primary-light"
      />
      <SummaryCard
        icon={<CheckCircle2 className="h-5 w-5 text-success" />}
        label="Paid"
        value={formatCurrency(paidAmount)}
        backgroundClass="bg-success-light"
        subtitle={`${paidCount} of ${payments.length}`}
      />
      <SummaryCard
        icon={<Clock className="h-5 w-5 text-danger" />}
        label="Pending"
        value={formatCurrency(pendingAmount)}
        backgroundClass="bg-danger-light"
      />

      <div className="sm:col-span-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted-light">
          <div
            className="h-full rounded-full bg-success transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  backgroundClass,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  backgroundClass: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${backgroundClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
