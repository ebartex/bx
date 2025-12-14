// Funkcja do konwersji polskich znaków diakrytycznych na ich odpowiedniki bez ogonków
function normalizePolishChars(str: string): string {
  const map: { [key: string]: string } = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
  }
  
  return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (match) => map[match] || match)
}

// Funkcja slugify z normalizacją polskich znaków
export function slugify(text: string): string {
  // Najpierw normalizujemy polskie znaki
  const normalizedText = normalizePolishChars(text);

  return normalizedText
    .toLowerCase()                       // Konwertuje wszystkie litery na małe
    .replace(/ /g, '-')                   // Zastępuje spacje myślnikami
    .replace(/[^\w-]+/g, '')              // Usuwa znaki specjalne
    .replace(/--+/g, '-')                 // Zastępuje podwójne myślniki pojedynczymi
    .trim();                              // Usuwa spacje z początku i końca
}
