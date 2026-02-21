export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getNextMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (monthNumber === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${String(monthNumber + 1).padStart(2, "0")}`;
}

export function getPreviousMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (monthNumber === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function formatCurrency(amount: string | number): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericAmount);
}
