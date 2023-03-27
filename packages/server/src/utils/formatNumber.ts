export function formatNumber(number: number, sufix?: string) {
  return `${Intl.NumberFormat('pt-BR').format(number)}${sufix ? sufix : ''}`;
}
