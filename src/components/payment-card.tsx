"use client";

import { useOptimistic, useTransition } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
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
    if (!confirm("Excluir este pagamento?")) {
      return;
    }
    startTransition(async () => {
      await deletePayment(payment.id);
    });
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
        optimisticPaid
          ? "border-border bg-muted-light/50"
          : "border-border bg-card hover:border-muted"
      }`}
    >
      <button
        onClick={handleTogglePaid}
        disabled={isPending}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
          optimisticPaid
            ? "border-success bg-success text-white"
            : "border-muted/40 hover:border-foreground"
        }`}
        aria-label={optimisticPaid ? "Marcar como não pago" : "Marcar como pago"}
      >
        {optimisticPaid && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={`truncate text-sm font-medium ${
              optimisticPaid ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {payment.description}
          </p>
          <p
            className={`shrink-0 text-sm tabular-nums ${
              optimisticPaid ? "text-muted" : "font-semibold text-foreground"
            }`}
          >
            {formatCurrency(payment.amount)}
          </p>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-muted">Dia {payment.dueDay}</span>
          {payment.category && (
            <span className="rounded bg-muted-light px-1.5 py-0.5 text-[10px] font-medium text-muted">
              {payment.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(payment)}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-muted-light hover:text-foreground"
          aria-label="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-light hover:text-danger disabled:opacity-50"
          aria-label="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
