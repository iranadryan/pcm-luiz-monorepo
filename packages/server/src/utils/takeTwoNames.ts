export function takeTwoNames(name: string) {
  const conjunctions = ['DO', 'DA', 'DOS', 'DAS', 'DE'];
  let result = name.split(' ');

  if (conjunctions.includes(result[1])) {
    result = result.slice(0, 3);
  } else {
    result = result.slice(0, 2);
  }
  return result.join(' ');
}
