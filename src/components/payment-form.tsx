"use client";

import { useRef, useEffect } from "react";
import { useTransition } from "react";
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

  function handleDialogClose() {
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className="w-full max-w-md rounded-2xl border border-card-border bg-card p-0 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">
          {editingPayment ? "Edit Payment" : "New Payment"}
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-muted-light hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-4 p-6">
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            defaultValue={editingPayment?.description ?? ""}
            placeholder="e.g. Netflix, Rent, Electricity"
            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amount"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={editingPayment?.amount ?? ""}
              placeholder="0.00"
              className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <div>
            <label
              htmlFor="dueDay"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Due Day
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
              className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Category{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={editingPayment?.category ?? ""}
            placeholder="e.g. Streaming, Housing, Utilities"
            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-card-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted-light"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : editingPayment
                ? "Update"
                : "Add Payment"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
