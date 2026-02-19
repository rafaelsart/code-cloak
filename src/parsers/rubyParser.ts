import { ParseResult, Token } from './baseParser';

const IDENTIFIER_REGEX = /\b([a-zA-Z_][a-zA-Z0-9_?!]*)\b/g;

function extractStrings(text: string): { value: string; start: number; end: number }[] {
  const results: { value: string; start: number; end: number }[] = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === '\\') j += 2;
        else if (text[j] === quote) break;
        else j++;
      }
      if (j < text.length) {
        const value = text.substring(i + 1, j);
        results.push({ value, start: i, end: j + 1 });
        i = j + 1;
        continue;
      }
    }
    // Ruby %q{} %Q{} etc. - skip for MVP, handle " and ' only
    i++;
  }
  return results;
}

function extractIdentifiers(text: string): { value: string; start: number; end: number }[] {
  const results: { value: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  IDENTIFIER_REGEX.lastIndex = 0;
  while ((m = IDENTIFIER_REGEX.exec(text)) !== null) {
    results.push({ value: m[1], start: m.index, end: m.index + m[1].length });
  }
  return results;
}

export function parseRuby(text: string): ParseResult {
  const identifiers: string[] = [];
  const strings: string[] = [];
  const tokens: Token[] = [];

  const idMatches = extractIdentifiers(text);
  const strMatches = extractStrings(text);

  const seenIds = new Set<string>();
  for (const m of idMatches) {
    tokens.push({ type: 'identifier', value: m.value, start: m.start, end: m.end });
    if (!seenIds.has(m.value)) {
      seenIds.add(m.value);
      identifiers.push(m.value);
    }
  }

  const seenStrs = new Set<string>();
  for (const m of strMatches) {
    tokens.push({ type: 'string', value: m.value, start: m.start, end: m.end });
    if (!seenStrs.has(m.value)) {
      seenStrs.add(m.value);
      strings.push(m.value);
    }
  }

  return { identifiers, strings, tokens };
}
