import { transformWithContext, decloak, CloakContext } from './index';

describe('transformWithContext', () => {
  it('returns transformed and context with reverse idMap and strMap', () => {
    const input = 'const userName = "Hello"; const userEmail = "test@x.com"';
    const { transformed, context } = transformWithContext(input, { languageId: 'javascript' });

    expect(transformed).not.toContain('userName');
    expect(transformed).not.toContain('userEmail');
    expect(transformed).not.toContain('Hello');
    expect(transformed).not.toContain('test@x.com');

    expect(context.languageId).toBe('javascript');
    expect(Object.keys(context.idMap).length).toBeGreaterThan(0);
    expect(Object.keys(context.strMap).length).toBeGreaterThan(0);

    // idMap: mapped -> original
    for (const [mapped, original] of Object.entries(context.idMap)) {
      expect(transformed).toContain(mapped);
      expect(original).toMatch(/[a-zA-Z]/);
    }

    // strMap: mapped -> original
    for (const [mapped, original] of Object.entries(context.strMap)) {
      expect(transformed).toContain(mapped);
      expect(typeof original).toBe('string');
    }
  });

  it('context is serializable (objects and strings only)', () => {
    const input = 'const x = 1;';
    const { context } = transformWithContext(input, { languageId: 'javascript' });

    const serialized = JSON.stringify(context);
    const parsed = JSON.parse(serialized) as CloakContext;
    expect(parsed.languageId).toBe(context.languageId);
    expect(parsed.idMap).toEqual(context.idMap);
    expect(parsed.strMap).toEqual(context.strMap);
  });
});

describe('decloak', () => {
  describe('round-trip: cloak -> decloak restaura original', () => {
    it('JavaScript: identifiers e strings', () => {
      const input = 'const userName = "John Doe"; const userEmail = "john@example.com";';
      const { transformed, context } = transformWithContext(input, { languageId: 'javascript' });
      const restored = decloak(transformed, context);

      expect(restored).toBe(input);
    });

    it('JavaScript: múltiplos identificadores camelCase', () => {
      const input = 'function calculateOrder(total) { return total * 1.1; }';
      const { transformed, context } = transformWithContext(input, { languageId: 'javascript' });
      const restored = decloak(transformed, context);

      expect(restored).toBe(input);
    });

    it('Ruby: materials e material com colisão', () => {
      const input = 'materials.each do |material| puts material end';
      const { transformed, context } = transformWithContext(input, { languageId: 'ruby' });
      const restored = decloak(transformed, context);

      expect(restored).toBe(input);
    });

    it('TypeScript: preserva estrutura completa', () => {
      const input = 'const items: string[] = ["a", "b"]; items.map(x => x.toUpperCase());';
      const { transformed, context } = transformWithContext(input, { languageId: 'typescript' });
      const restored = decloak(transformed, context);

      expect(restored).toBe(input);
    });
  });

  describe('decloak of AI-refactored code', () => {
    it('restores identifiers when AI kept abbreviations', () => {
      const original = 'const userName = "test"; const userEmail = "a@b.com";';
      const { transformed, context } = transformWithContext(original, { languageId: 'javascript' });

      // Simula IA que refatorou mas manteve uN e uE
      const aiRefactored = transformed; // ou poderia ter mudado estrutura
      const restored = decloak(aiRefactored, context);

      expect(restored).toContain('userName');
      expect(restored).toContain('userEmail');
      expect(restored).toContain('test');
      expect(restored).toContain('a@b.com');
    });

    it('restores only partial selection (subset of code)', () => {
      const fullCode = 'const userName = "x"; const userEmail = "y"; console.log(userName);';
      const { transformed, context } = transformWithContext(fullCode, { languageId: 'javascript' });

      // Usuário selecionou só uma linha para decloak
      const selectedPart = transformed.split('\n')[0] ?? transformed;
      const restored = decloak(selectedPart, context);

      expect(restored).toContain('userName');
      expect(restored).toContain('userEmail');
    });

    it('ignores identifiers not in context (new from AI)', () => {
      const original = 'const userName = "x";';
      const { transformed, context } = transformWithContext(original, { languageId: 'javascript' });

      // IA adicionou novo identificador "newVar" que não existia
      const aiOutput = transformed + '\nconst newVar = 42;';
      const restored = decloak(aiOutput, context);

      expect(restored).toContain('userName');
      expect(restored).toContain('newVar'); // mantém o que não tem mapping
    });
  });

  describe('empty or partial context', () => {
    it('returns text unchanged when context has empty idMap and strMap', () => {
      const text = 'const uN = "He";';
      const context: CloakContext = { idMap: {}, strMap: {}, languageId: 'javascript' };
      const result = decloak(text, context);

      expect(result).toBe(text);
    });

    it('restores only what exists in context', () => {
      const text = 'const uN = "He"; const other = 1;';
      const context: CloakContext = {
        idMap: { uN: 'userName' },
        strMap: { He: 'Hello' },
        languageId: 'javascript'
      };
      const result = decloak(text, context);

      expect(result).toContain('userName');
      expect(result).toContain('Hello');
      expect(result).toContain('other'); // não tem mapping, fica igual
    });
  });

  describe('strings with different formats', () => {
    it('restores double-quoted strings', () => {
      const input = 'const msg = "Hello World";';
      const { transformed, context } = transformWithContext(input, {
        languageId: 'javascript',
        stringFormat: 'abbreviate'
      });
      const restored = decloak(transformed, context);
      expect(restored).toBe(input);
    });

    it('restores single-quoted strings', () => {
      const input = "const msg = 'Hello World';";
      const { transformed, context } = transformWithContext(input, {
        languageId: 'javascript',
        stringFormat: 'abbreviate'
      });
      const restored = decloak(transformed, context);
      expect(restored).toBe(input);
    });
  });

  describe('full flow: cloak -> paste to AI -> paste back -> decloak', () => {
    it('simulates real workflow with JavaScript code', () => {
      const original = `
function processUserData(userName, userEmail) {
  const greeting = "Hello " + userName;
  return { name: userName, email: userEmail };
}
`.trim();

      const { transformed, context } = transformWithContext(original, { languageId: 'javascript' });

      // Usuário colou na IA, IA refatorou (ex: extraiu variável)
      // Aqui simulamos que a IA manteve as abreviações
      const pastedBack = transformed;

      const restored = decloak(pastedBack, context);
      expect(restored).toBe(original);
    });

    it('simulates workflow with Ruby', () => {
      const original = 'users.map { |user| user.name }.select { |name| name.length > 0 }';
      const { transformed, context } = transformWithContext(original, { languageId: 'ruby' });
      const restored = decloak(transformed, context);
      expect(restored).toBe(original);
    });
  });
});
