export function generateUsername(name: string) {
  const names = name.split(' ');

  return `${names[0]}${names.length > 1 ? `.${names[names.length - 1]}` : ''}`
}
