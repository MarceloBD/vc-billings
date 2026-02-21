"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted">Nenhum pagamento ainda</p>
          <button
            onClick={handleAddNew}
            className="mt-3 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Adicionar pagamento
          </button>
        </div>
      ) : (
        <div className="space-y-2">
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
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white shadow-lg transition-all hover:opacity-80 hover:shadow-xl"
          aria-label="Adicionar pagamento"
        >
          <Plus className="h-5 w-5" />
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
