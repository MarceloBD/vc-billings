"use client";

import { useState, useTransition } from "react";
import { Copy, AlertTriangle } from "lucide-react";
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
      setTimeout(() => setResultMessage(null), 5000);
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
        className="flex items-center gap-2 rounded-xl border border-card-border bg-card px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted-light hover:text-foreground disabled:opacity-50"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Duplicate to Next Month</span>
        <span className="sm:hidden">Duplicate</span>
      </button>

      {showConfirm && (
        <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-2xl border border-card-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Duplicate payments?
              </p>
              <p className="mt-1 text-xs text-muted">
                All payments from{" "}
                <strong>{formatMonthLabel(currentMonth)}</strong> will be copied
                to <strong>{formatMonthLabel(targetMonth)}</strong> with unpaid
                status.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-xl border border-card-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted-light"
            >
              Cancel
            </button>
            <button
              onClick={handleDuplicate}
              disabled={isPending}
              className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {isPending ? "Duplicating..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {resultMessage && (
        <div
          className={`absolute right-0 top-full z-10 mt-2 w-80 rounded-2xl border p-4 shadow-xl ${
            resultMessage.success
              ? "border-success/30 bg-success-light"
              : "border-danger/30 bg-danger-light"
          }`}
        >
          <p
            className={`text-sm ${
              resultMessage.success ? "text-success" : "text-danger"
            }`}
          >
            {resultMessage.message}
          </p>
        </div>
      )}
    </div>
  );
}
