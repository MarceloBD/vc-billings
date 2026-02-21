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
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted">Total</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Pago</p>
          <p className="text-lg font-semibold text-success">
            {formatCurrency(paidAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Pendente</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(pendingAmount)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted-light">
          <div
            className="h-full rounded-full bg-success transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted">
          {paidCount}/{payments.length}
        </span>
      </div>
    </div>
  );
}
