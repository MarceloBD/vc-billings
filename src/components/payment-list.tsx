"use client";

import { useState } from "react";
import { Plus, Inbox } from "lucide-react";
import type { Payment } from "@/lib/db/schema";
import { PaymentCard } from "./payment-card";
import { PaymentForm } from "./payment-form";

interface PaymentListProps {
  payments: Payment[];
  currentMonth: string;
}

export function PaymentList({ payments, currentMonth }: PaymentListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  function handleEdit(payment: Payment) {
    setEditingPayment(payment);
    setIsFormOpen(true);
  }

  function handleClose() {
    setIsFormOpen(false);
    setEditingPayment(null);
  }

  function handleAddNew() {
    setEditingPayment(null);
    setIsFormOpen(true);
  }

  return (
    <>
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-card-border bg-card px-6 py-16 text-center">
          <Inbox className="mb-3 h-12 w-12 text-muted/40" />
          <p className="text-sm font-medium text-muted">
            No payments for this month
          </p>
          <p className="mt-1 text-xs text-muted/70">
            Add your first payment or duplicate from another month
          </p>
          <button
            onClick={handleAddNew}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add Payment
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <button
          onClick={handleAddNew}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
          aria-label="Add payment"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      <PaymentForm
        isOpen={isFormOpen}
        onClose={handleClose}
        currentMonth={currentMonth}
        editingPayment={editingPayment}
      />
    </>
  );
}
