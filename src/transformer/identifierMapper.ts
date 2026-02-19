/**
 * Maps identifiers to abbreviated forms:
 * - camelCase → cO (first letter of each word, preserve case)
 * - PascalCase → UP (first letter of each word, uppercase)
 * - snake_case → u_p (first letter of each part, lowercase + underscore)
 * - UPPER_SNAKE → A_K (first letter of each part, uppercase + underscore)
 *
 * Collisions resolved with next letter from original name: cO, cOa, cOb
 */

function splitCamelOrPascal(name: string): string[] {
  // Split on uppercase letters: calculateOrder -> [calculate, Order]
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < name.length; i++) {
    const c = name[i];
    if (c === c.toUpperCase() && c !== c.toLowerCase()) {
      if (current) parts.push(current);
      current = c.toLowerCase();
    } else {
      current += c;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function splitSnake(name: string): string[] {
  return name.split('_').filter(Boolean);
}

function isUpperSnake(name: string): boolean {
  return /^[A-Z][A-Z0-9_]*$/.test(name) && name.includes('_');
}

function isSnakeCase(name: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(name) && name.includes('_');
}

function isPascalCase(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name) && name.length > 1;
}

function isCamelCase(name: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(name) && /[A-Z]/.test(name);
}

/**
 * Generate base abbreviation for an identifier (without collision resolution)
 */
export function abbreviateIdentifier(name: string): string {
  if (!name || name.length === 0) return name;

  if (isUpperSnake(name)) {
    const parts = splitSnake(name);
    return parts.map(p => p[0]?.toUpperCase() ?? '').join('_');
  }

  if (isSnakeCase(name)) {
    const parts = splitSnake(name);
    return parts.map(p => p[0]?.toLowerCase() ?? '').join('_');
  }

  if (isPascalCase(name)) {
    const parts = splitCamelOrPascal(name);
    return parts.map(p => p[0]?.toUpperCase() ?? '').join('');
  }

  if (isCamelCase(name)) {
    const parts = splitCamelOrPascal(name);
    return parts.map((p, i) =>
      i === 0 ? p[0]?.toLowerCase() ?? '' : p[0]?.toUpperCase() ?? ''
    ).join('');
  }

  // Fallback: single char or unknown format
  return name[0] ?? name;
}

/**
 * Find next available letter in name for collision suffix (skip already used)
 */
function getNextLetterForCollision(name: string, usedLetters: Set<string>): string {
  const letters = name.split('').filter(c => /[a-zA-Z]/.test(c));
  for (const c of letters) {
    const lower = c.toLowerCase();
    if (!usedLetters.has(lower)) {
      usedLetters.add(lower);
      return lower;
    }
  }
  // Fallback: use index if no unique letter
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i);
    if (!usedLetters.has(letter)) {
      usedLetters.add(letter);
      return letter;
    }
  }
  return 'x';
}

export interface IdentifierMapping {
  original: string;
  mapped: string;
}

/**
 * Build mapping for unique identifiers, resolving collisions with next letter
 */
export function buildIdentifierMapping(
  identifiers: string[],
  isReserved: (id: string) => boolean
): Map<string, string> {
  const mapping = new Map<string, string>();
  const seen = new Map<string, string[]>(); // baseAbbrev -> [original names]

  for (const id of identifiers) {
    if (isReserved(id)) continue;
    if (mapping.has(id)) continue;

    const base = abbreviateIdentifier(id);
    if (!seen.has(base)) seen.set(base, []);
    seen.get(base)!.push(id);
  }

  for (const [base, originals] of seen) {
    if (originals.length === 1) {
      mapping.set(originals[0], base);
    } else {
      const usedLetters = new Set<string>();
      for (let i = 0; i < originals.length; i++) {
        const orig = originals[i];
        const suffix = i === 0 ? '' : getNextLetterForCollision(orig, usedLetters);
        mapping.set(orig, base + suffix);
      }
    }
  }

  return mapping;
}
