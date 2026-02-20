"use client";

import { useOptimistic, useTransition } from "react";
import { Check, Pencil, Trash2, Calendar } from "lucide-react";
import type { Payment } from "@/lib/db/schema";
import { togglePaymentPaid, deletePayment } from "@/actions/payment-actions";
import { formatCurrency } from "@/lib/month-helpers";

interface PaymentCardProps {
  payment: Payment;
  onEdit: (payment: Payment) => void;
}

export function PaymentCard({ payment, onEdit }: PaymentCardProps) {
  const [optimisticPaid, setOptimisticPaid] = useOptimistic(payment.isPaid);
  const [isPending, startTransition] = useTransition();

  function handleTogglePaid() {
    startTransition(async () => {
      setOptimisticPaid(!optimisticPaid);
      await togglePaymentPaid(payment.id, !payment.isPaid);
    });
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this payment?")) {
      return;
    }
    startTransition(async () => {
      await deletePayment(payment.id);
    });
  }

  return (
    <div
      className={`group relative rounded-2xl border bg-card p-4 transition-all ${
        optimisticPaid
          ? "border-success/30 bg-success-light/30"
          : "border-card-border hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={handleTogglePaid}
            disabled={isPending}
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
              optimisticPaid
                ? "border-success bg-success text-white"
                : "border-card-border hover:border-primary"
            }`}
            aria-label={optimisticPaid ? "Mark as unpaid" : "Mark as paid"}
          >
            {optimisticPaid && <Check className="h-3.5 w-3.5" />}
          </button>
          <div>
            <p
              className={`font-medium ${
                optimisticPaid
                  ? "text-muted line-through"
                  : "text-foreground"
              }`}
            >
              {payment.description}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted">
                <Calendar className="h-3 w-3" />
                Day {payment.dueDay}
              </span>
              {payment.category && (
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                  {payment.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <p
          className={`shrink-0 text-right text-base font-bold ${
            optimisticPaid ? "text-muted" : "text-foreground"
          }`}
        >
          {formatCurrency(payment.amount)}
        </p>
      </div>

      <div className="mt-3 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(payment)}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-muted-light hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-danger transition-colors hover:bg-danger-light disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
