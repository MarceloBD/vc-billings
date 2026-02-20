"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getNextMonth,
  getPreviousMonth,
  formatMonthLabel,
} from "@/lib/month-helpers";

interface MonthSelectorProps {
  currentMonth: string;
}

export function MonthSelector({ currentMonth }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigateToMonth(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigateToMonth(getPreviousMonth(currentMonth))}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-card text-muted transition-colors hover:bg-muted-light hover:text-foreground"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[160px] text-center text-sm font-semibold text-foreground">
        {formatMonthLabel(currentMonth)}
      </span>
      <button
        onClick={() => navigateToMonth(getNextMonth(currentMonth))}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-card text-muted transition-colors hover:bg-muted-light hover:text-foreground"
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
