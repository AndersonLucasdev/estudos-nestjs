export function TrimSpaces(value: string): string {
    return value.trim();
}

export function CapitalFirstLetter(texto: string): string {
    return (texto)
      .trim() // Remove espaços em branco no início e no final da string
      .replace(/\s+/g, ' ') // Remove espaços extras entre as palavras
      .toLowerCase() // Converte todo o texto para minúsculas
      .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); // Converte as primeiras letras de cada palavra para maiúsculo
  
}
