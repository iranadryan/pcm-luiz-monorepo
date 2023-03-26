export function formatNumber(number: number, sufix?: string) {
  return `${Intl.NumberFormat().format(number)}${sufix ? sufix : ''}`;
}
