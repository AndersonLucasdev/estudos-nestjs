export function TrimSpaces(value: any): string {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
}

export function CapitalFirstLetter(texto: string): string {
  console.log(texto)
  return texto
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}
