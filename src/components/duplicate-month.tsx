"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { duplicateMonthPayments } from "@/actions/payment-actions";
import { formatMonthLabel, getNextMonth } from "@/lib/month-helpers";

interface DuplicateMonthProps {
  currentMonth: string;
  hasPayments: boolean;
}

export function DuplicateMonth({
  currentMonth,
  hasPayments,
}: DuplicateMonthProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  function handleDuplicate() {
    startTransition(async () => {
      const result = await duplicateMonthPayments(currentMonth);
      setResultMessage(result);
      setShowConfirm(false);
      setTimeout(() => setResultMessage(null), 4000);
    });
  }

  if (!hasPayments) {
    return null;
  }

  const targetMonth = getNextMonth(currentMonth);

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-muted-light hover:text-foreground disabled:opacity-50"
      >
        <Copy className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Duplicar para o próximo mês</span>
        <span className="sm:hidden">Duplicar</span>
      </button>

      {showConfirm && (
        <div className="absolute right-0 top-full z-10 mt-1.5 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
          <p className="text-sm text-foreground">
            Copiar todos os pagamentos para{" "}
            <strong>{formatMonthLabel(targetMonth)}</strong>?
          </p>
          <p className="mt-1 text-xs text-muted">
            Todos serão marcados como não pagos.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted-light"
            >
              Cancelar
            </button>
            <button
              onClick={handleDuplicate}
              disabled={isPending}
              className="flex-1 rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {isPending ? "Copiando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}

      {resultMessage && (
        <div
          className={`absolute right-0 top-full z-10 mt-1.5 w-72 rounded-xl border p-3 shadow-lg ${
            resultMessage.success
              ? "border-success/20 bg-success-light text-success"
              : "border-danger/20 bg-danger-light text-danger"
          }`}
        >
          <p className="text-xs">{resultMessage.message}</p>
        </div>
      )}
    </div>
  );
}
