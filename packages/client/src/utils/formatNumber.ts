export function formatNumber(number: number, suffix?: string) {
  return `${Intl.NumberFormat().format(number)}${suffix ? suffix : ''}`;
}
