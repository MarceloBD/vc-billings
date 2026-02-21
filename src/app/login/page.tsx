"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-xs">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Payflow
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Digite sua senha para continuar
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Senha"
            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground"
          />

          {state?.error && (
            <p className="text-sm text-danger">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-foreground px-3.5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
