"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">VC Billings</h1>
          <p className="mt-1 text-sm text-muted">
            Enter your password to continue
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="Enter your password"
              className="w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </div>

          {state?.error && (
            <div className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
