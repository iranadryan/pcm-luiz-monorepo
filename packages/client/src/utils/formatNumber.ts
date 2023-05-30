export function formatNumber(
  number: number,
  suffix?: string,
  precision?: number
) {
  return `${Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: precision
  }).format(number)}${suffix ? suffix : ''}`;
}
