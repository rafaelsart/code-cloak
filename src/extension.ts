import * as vscode from 'vscode';
import { transform, transformWithContext, decloak, CloakContext } from './transformer';
import { StringFormat } from './transformer/stringMapper';
import { getDefaultKeywordsByLanguage } from './utils/keywords';

const LAST_CLOAK_CONTEXT_KEY = 'codeCloak.lastCloakContext';

let extensionContext: vscode.ExtensionContext;

function getSelectedText(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return null;
  const selection = editor.selection;
  if (selection.isEmpty) return null;
  return editor.document.getText(selection);
}

function getLanguageId(): string {
  const editor = vscode.window.activeTextEditor;
  return editor?.document.languageId ?? 'plaintext';
}

function runTransform(openInNewTab: boolean) {
  const text = getSelectedText();
  if (!text) {
    vscode.window.showWarningMessage('CodeCloak: Select a code snippet first.');
    return;
  }

  const config = vscode.workspace.getConfiguration('codeCloak');
  const preserveReactHooks = config.get<boolean>('preserveReactHooks', true);
  const stringFormat = config.get<StringFormat>('stringFormat', 's1');
  const copyToClipboard = config.get<boolean>('copyToClipboard', true);
  const customKeywords = config.get<Record<string, string[]>>('customKeywords', {});
  const keywordsAdd = config.get<Record<string, string[]>>('keywordsAdd', {});
  const keywordsExclude = config.get<Record<string, string[]>>('keywordsExclude', {});

  const languageId = getLanguageId();
  const { transformed, context } = transformWithContext(text, {
    languageId,
    preserveReactHooks,
    stringFormat,
    customKeywords,
    keywordsAdd,
    keywordsExclude
  });

  extensionContext.globalState.update(LAST_CLOAK_CONTEXT_KEY, context);

  if (copyToClipboard) {
    vscode.env.clipboard.writeText(transformed);
  }

  if (openInNewTab) {
    vscode.workspace.openTextDocument({ content: transformed, language: languageId })
      .then(doc => vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside, preview: false }));
  }

  if (copyToClipboard && !openInNewTab) {
    vscode.window.showInformationMessage('CodeCloak: Transformed code copied to clipboard.');
  }
}

function runDecloak() {
  const text = getSelectedText();
  if (!text) {
    vscode.window.showWarningMessage('CodeCloak: Select a code snippet first.');
    return;
  }

  const stored = extensionContext.globalState.get<CloakContext>(LAST_CLOAK_CONTEXT_KEY);
  if (!stored) {
    vscode.window.showWarningMessage(
      'CodeCloak: No cloak context found. Run Cloak & Copy first.'
    );
    return;
  }

  const decloaked = decloak(text, stored);
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit(editBuilder => {
      editBuilder.replace(editor.selection, decloaked);
    });
  }
  vscode.window.showInformationMessage('CodeCloak: Code restored (decloak).');
}

const CONFIG_LANG_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  javascriptreact: 'javascript',
  typescriptreact: 'typescript',
  ruby: 'ruby',
  erb: 'ruby'
};

function runAddAsKeyword() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('CodeCloak: No active editor.');
    return;
  }

  const position = editor.selection.active;
  const wordRange = editor.document.getWordRangeAtPosition(position);
  if (!wordRange) {
    vscode.window.showWarningMessage('CodeCloak: Place the cursor on a word.');
    return;
  }

  const word = editor.document.getText(wordRange);
  const languageId = editor.document.languageId;
  const configKey = CONFIG_LANG_MAP[languageId] ?? languageId;

  const config = vscode.workspace.getConfiguration('codeCloak');
  const customKeywords = config.get<Record<string, string[]>>('customKeywords', {});
  const keywordsAdd = config.get<Record<string, string[]>>('keywordsAdd', {});
  const currentAdd = keywordsAdd[configKey] ?? [];
  const currentLegacy = customKeywords[configKey] ?? [];
  if (currentAdd.includes(word) || currentLegacy.includes(word)) {
    vscode.window.showInformationMessage(`CodeCloak: "${word}" is already a keyword.`);
    return;
  }

  const updated = { ...keywordsAdd, [configKey]: [...currentAdd, word] };
  config.update('keywordsAdd', updated, vscode.ConfigurationTarget.Global).then(() => {
    vscode.window.showInformationMessage(`CodeCloak: "${word}" added as keyword for ${configKey}.`);
  });
}

function runShowDefaultKeywords() {
  const items = [
    { label: 'JavaScript', id: 'javascript' },
    { label: 'TypeScript', id: 'typescript' },
    { label: 'Ruby', id: 'ruby' }
  ];
  vscode.window.showQuickPick(items, {
    placeHolder: 'Select language to view default keywords',
    title: 'CodeCloak: Default Keywords'
  }).then(selected => {
    if (!selected) return;
    const byLang = getDefaultKeywordsByLanguage();
    const data = byLang[selected.id as keyof typeof byLang] ?? [];
    const lines: string[] = [
      `# CodeCloak - Default keywords: ${selected.label}`,
      '',
      'To add keywords, use `codeCloak.keywordsAdd` in settings.',
      'To remove keywords from defaults, use `codeCloak.keywordsExclude`.',
      '',
      '---',
      ''
    ];
    for (const { category, keywords } of data) {
      lines.push(`## ${category}`);
      lines.push('');
      lines.push(keywords.join(', '));
      lines.push('');
    }
    const content = lines.join('\n');
    vscode.workspace.openTextDocument({
      content,
      language: 'markdown'
    }).then(doc => {
      vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside, preview: false });
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  extensionContext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCloak.transformAndCopy', () => runTransform(false))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCloak.transformAndCopyOpenTab', () => runTransform(true))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCloak.decloak', runDecloak)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCloak.addAsKeyword', runAddAsKeyword)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCloak.showDefaultKeywords', runShowDefaultKeywords)
  );
}

export function deactivate() {}
