"use client";

import { LogOut, Receipt } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";

export function Header() {
  return (
    <header className="border-b border-card-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-foreground">VC Billings</h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-muted-light hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
