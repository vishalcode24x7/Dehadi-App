export function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0
  return `₹${numericAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`
}
