export function TrimSpaces(value: string): string {
  return value.trim();
  }
  
  export function CapitalFirstLetter(texto: string): string {
    return texto
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase());
  }