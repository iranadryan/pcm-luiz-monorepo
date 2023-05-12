export function formatDays(daysNumber: number) {
  if (daysNumber === 0) {
    return '0 dias';
  }

  if (daysNumber < 0) {
    return 'Falha da formatação';
  }

  if (daysNumber < 1) {
    const hours = Math.floor(daysNumber * 24);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  const [days] = String(daysNumber).split('.');
  const hours = Math.floor((daysNumber % Number(days)) * 24);

  return `${days} ${days === '1' ? 'dia' : 'dias'}${hours === 0 ? '' : ` e ${hours} ${hours === 1 ? 'hora' : 'horas'}`}`;
}
