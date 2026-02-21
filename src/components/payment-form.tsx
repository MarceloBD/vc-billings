"use client";

import { useRef, useEffect, useTransition } from "react";
import { X } from "lucide-react";
import type { Payment } from "@/lib/db/schema";
import { createPayment, updatePayment } from "@/actions/payment-actions";

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  editingPayment: Payment | null;
}

export function PaymentForm({
  isOpen,
  onClose,
  currentMonth,
  editingPayment,
}: PaymentFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (editingPayment) {
        formData.set("id", editingPayment.id.toString());
        await updatePayment(formData);
      } else {
        formData.set("month", currentMonth);
        await createPayment(formData);
      }
      formRef.current?.reset();
      onClose();
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-sm rounded-xl border border-border bg-card p-0 shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">
          {editingPayment ? "Editar pagamento" : "Novo pagamento"}
        </h2>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-3 p-5">
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-xs font-medium text-foreground"
          >
            Descrição
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            defaultValue={editingPayment?.description ?? ""}
            placeholder="Netflix, Aluguel, Energia..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="amount"
              className="mb-1 block text-xs font-medium text-foreground"
            >
              Valor (R$)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={editingPayment?.amount ?? ""}
              placeholder="0,00"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="dueDay"
              className="mb-1 block text-xs font-medium text-foreground"
            >
              Dia de vencimento
            </label>
            <input
              id="dueDay"
              name="dueDay"
              type="number"
              min="1"
              max="31"
              required
              defaultValue={editingPayment?.dueDay ?? ""}
              placeholder="1-31"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-xs font-medium text-muted"
          >
            Categoria (opcional)
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={editingPayment?.category ?? ""}
            placeholder="Streaming, Moradia..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted-light"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {isPending
              ? "Salvando..."
              : editingPayment
                ? "Atualizar"
                : "Adicionar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
