import { buildIdentifierMapping } from './identifierMapper';
import { buildStringMapping, StringFormat } from './stringMapper';
import { parseJsTs } from '../parsers/jsTsParser';
import { parseRuby } from '../parsers/rubyParser';
import { isReserved } from '../utils/keywords';
import { Parser } from '../parsers/baseParser';

/** Last cloak context, serializable for storage (mapped -> original) */
export interface CloakContext {
  idMap: Record<string, string>;
  strMap: Record<string, string>;
  languageId: string;
}

const JS_LIKE_LANGS = new Set([
  'javascript',
  'typescript',
  'javascriptreact',
  'typescriptreact',
  'graphql',
  'html'
]);

const RUBY_LANGS = new Set(['ruby', 'erb']);

function getParser(languageId: string): Parser {
  if (JS_LIKE_LANGS.has(languageId)) return parseJsTs;
  if (RUBY_LANGS.has(languageId)) return parseRuby;
  return parseJsTs;
}

function getIsReserved(
  languageId: string,
  preserveReactHooks: boolean,
  customKeywords: Record<string, string[]> = {},
  keywordsAdd: Record<string, string[]> = {},
  keywordsExclude: Record<string, string[]> = {}
): (id: string) => boolean {
  return (id: string) =>
    isReserved(id, languageId, {
      preserveReactHooks,
      customKeywords,
      keywordsAdd,
      keywordsExclude
    });
}

function applyReplacements(
  text: string,
  replacements: { start: number; end: number; replacement: string }[]
): string {
  const sorted = [...replacements].sort((a, b) => b.start - a.start);
  let result = text;
  for (const r of sorted) {
    result = result.substring(0, r.start) + r.replacement + result.substring(r.end);
  }
  return result;
}

export interface TransformOptions {
  languageId: string;
  preserveReactHooks?: boolean;
  stringFormat?: StringFormat;
  customKeywords?: Record<string, string[]>;
  keywordsAdd?: Record<string, string[]>;
  keywordsExclude?: Record<string, string[]>;
}

export function transform(
  text: string,
  options: TransformOptions
): string {
  const {
    languageId,
    preserveReactHooks = true,
    stringFormat = 'abbreviate',
    customKeywords = {},
    keywordsAdd = {},
    keywordsExclude = {}
  } = options;

  const parser = getParser(languageId);
  const isReservedFn = getIsReserved(
    languageId,
    preserveReactHooks,
    customKeywords,
    keywordsAdd,
    keywordsExclude
  );

  const { identifiers, strings, tokens } = parser(text);

  const idMapping = buildIdentifierMapping(identifiers, isReservedFn);
  const strMapping = buildStringMapping(strings, stringFormat);

  const replacements: { start: number; end: number; replacement: string }[] = [];
  const stringSpans: { start: number; end: number }[] = [];

  for (const token of tokens) {
    if (token.type === 'string') {
      stringSpans.push({ start: token.start, end: token.end });
    }
  }

  function isInsideString(start: number, end: number): boolean {
    return stringSpans.some(s => start >= s.start && end <= s.end);
  }

  for (const token of tokens) {
    if (token.type === 'identifier') {
      if (isInsideString(token.start, token.end)) continue;
      const mapped = idMapping.get(token.value);
      if (mapped && mapped !== token.value) {
        replacements.push({ start: token.start, end: token.end, replacement: mapped });
      }
    } else if (token.type === 'string') {
      const mapped = strMapping.get(token.value);
      if (mapped) {
        const quoteChar = text[token.start];
        replacements.push({
          start: token.start,
          end: token.end,
          replacement: `${quoteChar}${mapped}${quoteChar}`
        });
      }
    }
  }

  return applyReplacements(text, replacements);
}

export interface TransformWithContextResult {
  transformed: string;
  context: CloakContext;
}

/** Transforms code and returns result with context for later decloak */
export function transformWithContext(
  text: string,
  options: TransformOptions
): TransformWithContextResult {
  const transformed = transform(text, options);
  const {
    languageId,
    preserveReactHooks = true,
    stringFormat = 'abbreviate',
    customKeywords = {},
    keywordsAdd = {},
    keywordsExclude = {}
  } = options;

  const parser = getParser(languageId);
  const isReservedFn = getIsReserved(
    languageId,
    preserveReactHooks,
    customKeywords,
    keywordsAdd,
    keywordsExclude
  );

  const { identifiers, strings, tokens } = parser(text);
  const idMapping = buildIdentifierMapping(identifiers, isReservedFn);
  const strMapping = buildStringMapping(strings, stringFormat);

  const idMap: Record<string, string> = {};
  for (const [orig, mapped] of idMapping) {
    if (mapped !== orig) idMap[mapped] = orig;
  }
  const strMap: Record<string, string> = {};
  for (const [orig, mapped] of strMapping) {
    if (mapped !== orig) strMap[mapped] = orig;
  }

  return {
    transformed,
    context: { idMap, strMap, languageId }
  };
}

/** Restores cloaked code using the last cloak context */
export function decloak(text: string, context: CloakContext): string {
  const parser = getParser(context.languageId);
  const { tokens } = parser(text);

  const replacements: { start: number; end: number; replacement: string }[] = [];

  for (const token of tokens) {
    if (token.type === 'identifier') {
      const original = context.idMap[token.value];
      if (original) {
        replacements.push({ start: token.start, end: token.end, replacement: original });
      }
    } else if (token.type === 'string') {
      const original = context.strMap[token.value];
      if (original) {
        const quoteChar = text[token.start];
        replacements.push({
          start: token.start,
          end: token.end,
          replacement: `${quoteChar}${original}${quoteChar}`
        });
      }
    }
  }

  return applyReplacements(text, replacements);
}
