/**
 * Reserved keywords - manual lists to avoid ESM dependency (reserved-identifiers is ESM-only)
 */

// JavaScript/ES2023 keywords
const JS_KEYWORDS = new Set([
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof',
  'interface', 'let', 'new', 'null', 'package', 'private', 'protected', 'public',
  'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield'
]);

// TypeScript adds
const TS_EXTRA = new Set([
  'any', 'unknown', 'never', 'object', 'string', 'number', 'boolean',
  'symbol', 'bigint', 'undefined'
]);
const TS_KEYWORDS = new Set([...JS_KEYWORDS, ...TS_EXTRA]);

// JavaScript CommonJS and globals
const JS_GLOBALS = new Set([
  'require', 'module', 'exports', '__dirname', '__filename',
  'undefined', 'NaN', 'Infinity', 'globalThis', 'console', 'process', 'Buffer',
  'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect',
  'JSON', 'Math', 'Date', 'Array', 'Object', 'Function', 'Number', 'String',
  'Boolean', 'RegExp', 'Error', 'eval', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'decodeURI', 'encodeURI', 'decodeURIComponent', 'encodeURIComponent'
]);

// React core
const REACT_CORE = new Set([
  'React', 'Component', 'PureComponent', 'Fragment', 'StrictMode', 'Suspense',
  'lazy', 'memo', 'createElement', 'cloneElement', 'createContext', 'createRef',
  'forwardRef', 'useImperativeHandle'
]);

// JSX intrinsic HTML elements (lowercase)
const JSX_INTRINSIC = new Set([
  'div', 'span', 'p', 'a', 'img', 'input', 'button', 'form', 'label', 'select',
  'textarea', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'header', 'footer', 'main', 'section', 'article', 'nav', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr'
]);

// JSX common props
const JSX_PROPS = new Set([
  'className', 'class', 'style', 'onClick', 'onChange', 'onSubmit', 'onBlur', 'onFocus',
  'onKeyDown', 'onKeyUp', 'children', 'ref', 'key', 'id', 'type', 'value', 'defaultValue',
  'placeholder', 'disabled', 'checked', 'href', 'src', 'alt', 'target', 'dangerouslySetInnerHTML'
]);

// React Native
const REACT_NATIVE = new Set([
  'View', 'Text', 'Image', 'ScrollView', 'TextInput', 'FlatList', 'SectionList',
  'TouchableOpacity', 'TouchableHighlight', 'TouchableWithoutFeedback', 'Pressable',
  'Button', 'Switch', 'ActivityIndicator', 'Alert', 'StyleSheet', 'Dimensions',
  'Platform', 'KeyboardAvoidingView', 'SafeAreaView', 'Modal', 'StatusBar',
  'RefreshControl', 'VirtualizedList'
]);

// React Redux
const REACT_REDUX = new Set([
  'useSelector', 'useDispatch', 'useStore', 'Provider', 'connect', 'batch'
]);

// Lodash - all functions from https://lodash.com/docs/
const LODASH = new Set([
  'chunk', 'compact', 'concat', 'difference', 'differenceBy', 'differenceWith',
  'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex', 'findLastIndex',
  'first', 'flatten', 'flattenDeep', 'flattenDepth', 'fromPairs', 'head', 'indexOf',
  'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'join', 'last',
  'lastIndexOf', 'nth', 'pull', 'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt',
  'remove', 'reverse', 'slice', 'sortedIndex', 'sortedIndexBy', 'sortedIndexOf',
  'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy',
  'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union', 'unionBy',
  'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith', 'without',
  'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep', 'zipWith',
  'countBy', 'each', 'eachRight', 'every', 'filter', 'find', 'findLast',
  'flatMap', 'flatMapDeep', 'flatMapDepth', 'forEach', 'forEachRight', 'groupBy',
  'includes', 'invokeMap', 'keyBy', 'map', 'orderBy', 'partition', 'reduce',
  'reduceRight', 'reject', 'sample', 'sampleSize', 'shuffle', 'size', 'some', 'sortBy',
  'after', 'ary', 'before', 'bind', 'bindKey', 'curry', 'curryRight', 'debounce',
  'defer', 'delay', 'flip', 'memoize', 'negate', 'once', 'overArgs', 'partial',
  'partialRight', 'rearg', 'rest', 'spread', 'throttle', 'unary', 'wrap',
  'castArray', 'clone', 'cloneDeep', 'cloneDeepWith', 'cloneWith', 'conformsTo',
  'eq', 'gt', 'gte', 'isArguments', 'isArray', 'isArrayBuffer', 'isArrayLike',
  'isArrayLikeObject', 'isBoolean', 'isBuffer', 'isDate', 'isElement', 'isEmpty',
  'isEqual', 'isEqualWith', 'isError', 'isFinite', 'isFunction', 'isInteger',
  'isLength', 'isMap', 'isMatch', 'isMatchWith', 'isNative', 'isNil', 'isNull',
  'isNumber', 'isObject', 'isObjectLike', 'isPlainObject', 'isRegExp', 'isSafeInteger',
  'isSet', 'isString', 'isSymbol', 'isTypedArray', 'isUndefined', 'isWeakMap',
  'isWeakSet', 'lt', 'lte', 'toArray', 'toFinite', 'toInteger', 'toLength',
  'toNumber', 'toPlainObject', 'toSafeInteger', 'toString',
  'add', 'ceil', 'divide', 'floor', 'max', 'maxBy', 'mean', 'meanBy', 'min',
  'minBy', 'multiply', 'round', 'subtract', 'sum', 'sumBy',
  'clamp', 'inRange', 'random',
  'assign', 'assignIn', 'assignInWith', 'assignWith', 'at', 'create', 'defaults',
  'defaultsDeep', 'entries', 'entriesIn', 'extend', 'extendWith', 'findKey',
  'findLastKey', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'get', 'has',
  'hasIn', 'invert', 'invertBy', 'invoke', 'keys', 'keysIn', 'mapKeys', 'mapValues',
  'merge', 'mergeWith', 'omit', 'omitBy', 'pick', 'pickBy', 'result', 'set',
  'setWith', 'toPairs', 'toPairsIn', 'transform', 'unset', 'update', 'updateWith',
  'values', 'valuesIn',
  'chain', 'tap', 'thru',
  'camelCase', 'capitalize', 'deburr', 'endsWith', 'escape', 'escapeRegExp',
  'kebabCase', 'lowerCase', 'lowerFirst', 'pad', 'padEnd', 'padStart', 'parseInt',
  'repeat', 'replace', 'snakeCase', 'split', 'startCase', 'startsWith', 'template',
  'toLower', 'toUpper', 'trim', 'trimEnd', 'trimStart', 'truncate', 'unescape',
  'upperCase', 'upperFirst', 'words',
  'attempt', 'bindAll', 'cond', 'conforms', 'constant', 'defaultTo', 'flow',
  'flowRight', 'identity', 'iteratee', 'matches', 'matchesProperty', 'method',
  'methodOf', 'mixin', 'noConflict', 'noop', 'nthArg', 'over', 'overEvery',
  'overSome', 'property', 'propertyOf', 'range', 'rangeRight', 'runInContext',
  'stubArray', 'stubFalse', 'stubObject', 'stubString', 'stubTrue', 'times',
  'toPath', 'uniqueId',
  'now'
]);

// JavaScript Array.prototype methods (appear after dot, e.g. arr.map)
const JS_ARRAY_METHODS = new Set([
  'at', 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find',
  'findIndex', 'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes',
  'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce',
  'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort', 'splice',
  'toLocaleString', 'toString', 'unshift', 'values'
]);

// JavaScript Object static methods (Object.keys, Object.assign, etc.)
const JS_OBJECT_METHODS = new Set([
  'assign', 'create', 'defineProperties', 'defineProperty', 'entries', 'freeze',
  'fromEntries', 'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors',
  'getOwnPropertyNames', 'getPrototypeOf', 'hasOwn', 'is', 'isExtensible',
  'isFrozen', 'isSealed', 'keys', 'preventExtensions', 'seal', 'setPrototypeOf',
  'values'
]);

// All JS/TS reserved (keywords + globals + React ecosystem + Lodash + Array/Object methods)
const JS_RESERVED = new Set([
  ...JS_KEYWORDS, ...JS_GLOBALS, ...REACT_CORE, ...JSX_INTRINSIC, ...JSX_PROPS,
  ...REACT_NATIVE, ...REACT_REDUX, ...LODASH, ...JS_ARRAY_METHODS, ...JS_OBJECT_METHODS
]);

const TS_RESERVED = new Set([
  ...JS_RESERVED, ...TS_EXTRA
]);

// React hooks - optionally preserved (user config)
export const REACT_HOOKS = new Set([
  'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback',
  'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue'
]);

// Ruby keywords
const RUBY_KEYWORDS = new Set([
  'alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'defined?',
  'do', 'else', 'elsif', 'end', 'ensure', 'false', 'for', 'if', 'in',
  'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry',
  'return', 'self', 'super', 'then', 'true', 'undef', 'unless', 'until',
  'when', 'while', 'yield'
]);

// Ruby pseudo-keywords and special constants
const RUBY_SPECIAL = new Set([
  '__FILE__', '__LINE__', '__ENCODING__', '__dir__', '__method__', '__callee__',
  'BEGIN', 'END'
]);

// Ruby Kernel methods
const RUBY_KERNEL = new Set([
  'require', 'require_relative', 'load', 'autoload', 'autoload?',
  'puts', 'p', 'print', 'printf', 'gets', 'readline', 'readlines', 'open', 'putc',
  'Array', 'Hash', 'Integer', 'Float', 'String', 'Complex', 'Rational',
  'raise', 'fail', 'catch', 'throw', 'lambda', 'proc',
  'exit', 'exit!', 'abort', 'at_exit', 'exec', 'fork', 'spawn', 'system',
  'eval', 'rand', 'srand', 'sleep', 'loop', 'warn', 'sprintf', 'format',
  'binding', 'block_given?', 'caller', 'tap', 'then', 'yield_self'
]);

// Ruby Object methods
const RUBY_OBJECT = new Set([
  'nil?', 'empty?', 'to_s', 'to_i', 'to_f', 'to_a', 'to_h', 'inspect',
  'class', 'is_a?', 'kind_of?', 'instance_of?', 'respond_to?', 'frozen?'
]);

// Rails
const RAILS_CONTROLLER = new Set([
  'before_action', 'after_action', 'around_action', 'skip_before_action', 'skip_after_action', 'skip_around_action',
  'render', 'redirect_to', 'redirect_back', 'redirect_back_or_to', 'head',
  'params', 'request', 'response', 'session', 'cookies', 'flash',
  'respond_to', 'respond_with'
]);

const RAILS_ACTIVE_RECORD = new Set([
  'where', 'select', 'distinct', 'excluding', 'order', 'reorder', 'group', 'having',
  'limit', 'offset', 'joins', 'left_joins', 'includes', 'preload', 'eager_load',
  'find', 'find_by', 'first', 'last', 'take', 'exists?', 'any?',
  'count', 'sum', 'average', 'minimum', 'maximum', 'pluck',
  'create_with', 'readonly', 'and', 'or',
  'belongs_to', 'has_many', 'has_one', 'has_and_belongs_to_many',
  'dependent', 'through', 'source', 'class_name', 'foreign_key',
  'validates', 'validates_presence_of', 'validates_uniqueness_of', 'validates_length_of',
  'validates_format_of', 'validates_numericality_of', 'validate', 'valid?', 'invalid?',
  'before_save', 'after_save', 'before_create', 'after_create', 'before_update', 'after_update',
  'before_destroy', 'after_destroy',
  'save', 'save!', 'create', 'create!', 'update', 'update!', 'destroy', 'destroy!',
  'new', 'build', 'reload', 'persisted?', 'new_record?'
]);

const RAILS_ROUTES = new Set([
  'root', 'resources', 'resource', 'member', 'collection', 'namespace',
  'link_to', 'button_to', 'form_for', 'form_with', 'form_tag',
  'content_tag', 'tag', 'image_tag', 'stylesheet_link_tag', 'javascript_include_tag'
]);

// Ruby Enumerable methods (appear after dot, e.g. materials.each)
const RUBY_ENUMERABLE = new Set([
  'all?', 'any?', 'chain', 'chunk', 'chunk_while', 'collect', 'collect_concat',
  'count', 'cycle', 'detect', 'drop', 'drop_while', 'each', 'each_cons',
  'each_entry', 'each_slice', 'each_with_index', 'each_with_object', 'entries',
  'filter', 'filter_map', 'find', 'find_all', 'find_index', 'first', 'flat_map',
  'grep', 'grep_v', 'group_by', 'include?', 'inject', 'lazy', 'map', 'max',
  'max_by', 'member?', 'min', 'min_by', 'minmax', 'minmax_by', 'none?', 'one?',
  'partition', 'reduce', 'reject', 'reverse_each', 'select', 'slice_after',
  'slice_before', 'slice_when', 'sort', 'sort_by', 'sum', 'take', 'take_while',
  'tally', 'to_a', 'to_h', 'uniq', 'zip'
]);

const RUBY_RESERVED = new Set([
  ...RUBY_KEYWORDS, ...RUBY_SPECIAL, ...RUBY_KERNEL, ...RUBY_OBJECT,
  ...RAILS_CONTROLLER, ...RAILS_ACTIVE_RECORD, ...RAILS_ROUTES, ...RUBY_ENUMERABLE
]);

export function isJsKeyword(identifier: string): boolean {
  return JS_KEYWORDS.has(identifier);
}

export function isTsKeyword(identifier: string): boolean {
  return TS_KEYWORDS.has(identifier);
}

export function isRubyKeyword(identifier: string): boolean {
  return RUBY_KEYWORDS.has(identifier);
}

export function isReactHook(identifier: string): boolean {
  return REACT_HOOKS.has(identifier);
}

export function isJsReserved(identifier: string): boolean {
  return JS_RESERVED.has(identifier);
}

export function isTsReserved(identifier: string): boolean {
  return TS_RESERVED.has(identifier);
}

export function isRubyReserved(identifier: string): boolean {
  return RUBY_RESERVED.has(identifier);
}

export const CONFIG_LANG_KEYS = ['javascript', 'typescript', 'ruby'] as const;

export type DefaultKeywordsByLang = Record<string, { category: string; keywords: string[] }[]>;

/**
 * Returns default keywords grouped by language and category (for display in settings/docs)
 */
export function getDefaultKeywordsByLanguage(): DefaultKeywordsByLang {
  return {
    javascript: [
      { category: 'Keywords (ES2023)', keywords: [...JS_KEYWORDS].sort() },
      { category: 'Globals', keywords: [...JS_GLOBALS].sort() },
      { category: 'React', keywords: [...REACT_CORE, ...JSX_INTRINSIC, ...JSX_PROPS, ...REACT_NATIVE, ...REACT_REDUX].sort() },
      { category: 'Lodash', keywords: [...LODASH].sort() },
      { category: 'Array methods', keywords: [...JS_ARRAY_METHODS].sort() },
      { category: 'Object methods', keywords: [...JS_OBJECT_METHODS].sort() }
    ],
    typescript: [
      { category: 'Keywords (ES2023)', keywords: [...JS_KEYWORDS].sort() },
      { category: 'TypeScript', keywords: [...TS_EXTRA].sort() },
      { category: 'Globals', keywords: [...JS_GLOBALS].sort() },
      { category: 'React', keywords: [...REACT_CORE, ...JSX_INTRINSIC, ...JSX_PROPS, ...REACT_NATIVE, ...REACT_REDUX].sort() },
      { category: 'Lodash', keywords: [...LODASH].sort() },
      { category: 'Array methods', keywords: [...JS_ARRAY_METHODS].sort() },
      { category: 'Object methods', keywords: [...JS_OBJECT_METHODS].sort() }
    ],
    ruby: [
      { category: 'Keywords', keywords: [...RUBY_KEYWORDS].sort() },
      { category: 'Kernel', keywords: [...RUBY_KERNEL].sort() },
      { category: 'Object', keywords: [...RUBY_OBJECT].sort() },
      { category: 'Enumerable', keywords: [...RUBY_ENUMERABLE].sort() },
      { category: 'Rails Controller', keywords: [...RAILS_CONTROLLER].sort() },
      { category: 'Rails ActiveRecord', keywords: [...RAILS_ACTIVE_RECORD].sort() },
      { category: 'Rails Routes', keywords: [...RAILS_ROUTES].sort() }
    ]
  };
}

/**
 * Flatten default keywords to a single array per language
 */
function getDefaultSetForLang(languageId: string): Set<string> {
  if (['javascript', 'javascriptreact', 'graphql', 'html'].includes(languageId)) {
    return new Set([...JS_RESERVED]);
  }
  if (['typescript', 'typescriptreact'].includes(languageId)) {
    return new Set([...TS_RESERVED]);
  }
  if (['ruby', 'erb'].includes(languageId)) {
    return new Set([...RUBY_RESERVED]);
  }
  return new Set([...JS_RESERVED]);
}

/**
 * Check if identifier is reserved for the given language, including custom keywords and excludes
 */
export function isReserved(
  identifier: string,
  languageId: string,
  options: {
    preserveReactHooks?: boolean;
    customKeywords?: Record<string, string[]>;
    keywordsAdd?: Record<string, string[]>;
    keywordsExclude?: Record<string, string[]>;
  } = {}
): boolean {
  const {
    preserveReactHooks = true,
    customKeywords = {},
    keywordsAdd = {},
    keywordsExclude = {}
  } = options;

  const configLangMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    javascriptreact: 'javascript',
    typescriptreact: 'typescript',
    ruby: 'ruby',
    erb: 'ruby'
  };
  const configKey = configLangMap[languageId] ?? languageId;

  // Merge customKeywords (legacy) + keywordsAdd
  const add = [...(customKeywords[configKey] ?? []), ...(keywordsAdd[configKey] ?? [])];
  if (add.includes(identifier)) return true;

  const exclude = new Set(keywordsExclude[configKey] ?? []);
  if (exclude.has(identifier)) return false;

  if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'graphql', 'html'].includes(languageId)) {
    if (preserveReactHooks && REACT_HOOKS.has(identifier)) return true;
    const defaults = getDefaultSetForLang(languageId);
    return defaults.has(identifier);
  }

  if (['ruby', 'erb'].includes(languageId)) {
    const defaults = getDefaultSetForLang(languageId);
    return defaults.has(identifier);
  }

  return false;
}
