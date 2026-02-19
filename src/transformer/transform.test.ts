import { transform } from './index';

describe('transform', () => {
  describe('Ruby - methods after dot (each, map, etc.)', () => {
    it('materials.each do |material| → m.each do |mm| (each preserved, collision with suffix)', () => {
      const input = 'materials.each do |material|';
      const result = transform(input, { languageId: 'ruby' });
      expect(result).toMatch(/m\.each do \|m[a-z]\|/);
      expect(result).not.toContain('materials');
      expect(result).not.toContain('material');
      expect(result).toContain('each');
    });

    it('preserves each as reserved method', () => {
      const input = 'items.each { |item| puts item }';
      const result = transform(input, { languageId: 'ruby' });
      expect(result).toContain('.each');
      expect(result).not.toMatch(/\.e\./);
    });

    it('preserves map, select, reduce in Ruby', () => {
      const input = 'users.map { |u| u.name }.select { |n| n }.reduce(:+)';
      const result = transform(input, { languageId: 'ruby' });
      expect(result).toContain('.map');
      expect(result).toContain('.select');
      expect(result).toContain('.reduce');
    });
  });

  describe('JavaScript - Array methods after dot', () => {
    it('preserves map in arr.map()', () => {
      const input = 'const items = [1, 2, 3]; items.map(x => x * 2)';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toContain('.map');
      expect(result).not.toMatch(/\.m\./);
    });

    it('preserves filter, reduce, forEach', () => {
      const input = 'data.filter(x => x).reduce((a, b) => a + b); list.forEach(fn)';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toContain('.filter');
      expect(result).toContain('.reduce');
      expect(result).toContain('.forEach');
    });
  });

  describe('Lodash - preserved functions', () => {
    it('preserves debounce', () => {
      const input = 'const fn = _.debounce(handler, 100)';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toContain('debounce');
      expect(result).not.toMatch(/d\b.*100/);
    });

    it('preserves throttle, get, map from Lodash', () => {
      const input = '_.throttle(fn, 500); _.get(obj, "path"); _.map(arr, x => x)';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toContain('throttle');
      expect(result).toContain('get');
      expect(result).toContain('map');
    });

    it('preserves import { debounce } from lodash', () => {
      const input = 'import { debounce, throttle } from "lodash"; debounce(fn, 100)';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toContain('debounce');
      expect(result).toContain('throttle');
    });
  });

  describe('abbreviation and collision', () => {
    it('snake_case materials and material → m and suffix (collision)', () => {
      const input = 'materials.each do |material| end';
      const result = transform(input, { languageId: 'ruby' });
      expect(result).toMatch(/m\.each do \|m[a-z]\|/);
      expect(result).not.toContain('materials');
      expect(result).not.toContain('material');
    });

    it('camelCase identifiers', () => {
      const input = 'const userName = "test"; const userEmail = "a@b.com"';
      const result = transform(input, { languageId: 'javascript' });
      expect(result).toMatch(/uN|uE/);
    });
  });

  describe('keywordsExclude - remove from defaults', () => {
    it('allows removing map from defaults to enable transformation', () => {
      const input = 'arr.map(x => x)';
      const withMap = transform(input, { languageId: 'javascript' });
      expect(withMap).toContain('.map');

      const withoutMap = transform(input, {
        languageId: 'javascript',
        keywordsExclude: { javascript: ['map'] }
      });
      expect(withoutMap).not.toContain('.map');
    });
  });

  describe('keywordsAdd - add custom', () => {
    it('preserves keywords added via keywordsAdd', () => {
      const input = 'minhaLib.doSomething()';
      const result = transform(input, {
        languageId: 'javascript',
        keywordsAdd: { javascript: ['minhaLib'] }
      });
      expect(result).toContain('minhaLib');
    });
  });
});
