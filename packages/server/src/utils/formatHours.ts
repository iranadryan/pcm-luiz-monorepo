export function formatHours(hoursNumber: number) {
  if (hoursNumber === 0) {
    return '00:00';
  }

  if (hoursNumber < 0) {
    return 'Falha na formatação';
  }

  const [hours] = String(hoursNumber).split('.');
  const minutes = Math.floor((hoursNumber % Number(hours)) * 60);

  return `${hours}:${String(minutes).length === 1 ? '0' : ''}${minutes}`;
}
