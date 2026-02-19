#!/usr/bin/env node
/**
 * Simple smoke test for the transform logic.
 * Run: node scripts/test-transform.js
 * (Requires: npm run compile first)
 */

const { transform } = require('../out/transformer/index.js');

const cases = [
  {
    name: 'camelCase identifier',
    input: 'const calculateOrder = 1;',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('cO') && !out.includes('calculateOrder')
  },
  {
    name: 'PascalCase identifier',
    input: 'const UserProfile = {};',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('UP') && !out.includes('UserProfile')
  },
  {
    name: 'snake_case identifier',
    input: 'user_profile = 1',
    opts: { languageId: 'ruby' },
    expect: (out) => out.includes('u_p') && !out.includes('user_profile')
  },
  {
    name: 'UPPER_SNAKE identifier',
    input: 'const API_KEY = "secret";',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('A_K') && (out.includes('"se"') || out.includes('"s1"'))
  },
  {
    name: 'keywords preserved',
    input: 'const x = function() { return true; };',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('function') && out.includes('return') && out.includes('true')
  },
  {
    name: 'require preserved',
    input: "const x = require('fs');",
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('require')
  },
  {
    name: 'View and Text preserved (JSX)',
    input: 'return <View><Text>hi</Text></View>;',
    opts: { languageId: 'javascriptreact' },
    expect: (out) => out.includes('View') && out.includes('Text')
  },
  {
    name: 'React preserved',
    input: "import React from 'react';",
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('React')
  },
  {
    name: 'useSelector preserved',
    input: 'const data = useSelector(s => s);',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('useSelector')
  },
  {
    name: 'module and exports preserved',
    input: 'module.exports = { foo };',
    opts: { languageId: 'javascript' },
    expect: (out) => out.includes('module') && out.includes('exports')
  },
  {
    name: 'className preserved',
    input: 'div className="x"',
    opts: { languageId: 'javascriptreact' },
    expect: (out) => out.includes('className')
  },
  {
    name: 'customKeywords: custom word preserved',
    input: 'minhaLib.doSomething()',
    opts: { languageId: 'javascript', customKeywords: { javascript: ['minhaLib'] } },
    expect: (out) => out.includes('minhaLib')
  },
  {
    name: 'customKeywords: custom preserved + other transformed',
    input: 'minhaLib.calculateOrder()',
    opts: { languageId: 'javascript', customKeywords: { javascript: ['minhaLib'] } },
    expect: (out) => out.includes('minhaLib') && out.includes('cO')
  },
  {
    name: 'Ruby: require preserved',
    input: "require 'rails'",
    opts: { languageId: 'ruby' },
    expect: (out) => out.includes('require')
  },
  {
    name: 'Rails: where preserved',
    input: 'User.where(active: true)',
    opts: { languageId: 'ruby' },
    expect: (out) => out.includes('where')
  },
  {
    name: 'string abbreviate: first 2 chars per word',
    input: 'const msg = "Isso é uma string";',
    opts: { languageId: 'javascript', stringFormat: 'abbreviate' },
    expect: (out) => out.includes('"Is é um st"')
  },
  {
    name: 'string abbreviate: path',
    input: 'const path = "/opt/teste/teste2";',
    opts: { languageId: 'javascript', stringFormat: 'abbreviate' },
    expect: (out) => out.includes('"/op/te/te2"')
  }
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  try {
    const out = transform(c.input, c.opts);
    if (c.expect(out)) {
      console.log('PASS:', c.name);
      passed++;
    } else {
      console.log('FAIL:', c.name, '- output:', out);
      failed++;
    }
  } catch (err) {
    console.log('FAIL:', c.name, '- error:', err.message);
    failed++;
  }
}

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
