export interface Token {
  type: 'identifier' | 'string';
  value: string;
  start: number;
  end: number;
}

export interface ParseResult {
  identifiers: string[];
  strings: string[];
  tokens: Token[];
}

export type Parser = (text: string) => ParseResult;
