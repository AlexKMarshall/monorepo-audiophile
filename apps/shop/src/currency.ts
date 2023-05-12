export function formatCurrency({
  currencyCode,
  amount,
}: {
  currencyCode: string
  amount: number
}) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
}
