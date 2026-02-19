/**
 * Maps string literals: s1/s2 (placeholder) or abbreviate (first 2 chars of each word)
 */

export type StringFormat = 's1' | 'str1' | 'abbreviate';

/**
 * Abbreviate string: first 2 chars of each "word" (split by whitespace, /, \)
 * Words can be letters or digits; "teste2" -> "te" + "2" = "te2"
 * "Isso é uma string" -> "Is é um st"
 * "/opt/teste/teste2" -> "/op/te/te2"
 */
export function abbreviateString(s: string): string {
  return s.replace(/([a-zA-Z\u00C0-\u024F]+)|([0-9]+)/g, (word) =>
    word.length >= 2 ? word.substring(0, 2) : word
  );
}

export function buildStringMapping(
  strings: string[],
  format: StringFormat = 's1'
): Map<string, string> {
  const mapping = new Map<string, string>();
  if (format === 'abbreviate') {
    for (const s of strings) {
      mapping.set(s, abbreviateString(s));
    }
    return mapping;
  }
  const prefix = format === 's1' ? 's' : 'str';
  let index = 1;
  for (const s of strings) {
    if (!mapping.has(s)) {
      mapping.set(s, `${prefix}${index}`);
      index++;
    }
  }
  return mapping;
}
