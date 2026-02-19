# CodeCloak

VS Code extension that transforms selected code for safe sharing with AI assistants. Variables, constants, and strings are anonymized to hide company-specific details.

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) to open the Extensions view
3. Search for **CodeCloak**
4. Click **Install**

### From VSIX (local build)

1. In the project directory, run:
   ```bash
   npm install
   npm run package
   ```
   (Or manually: `npm run compile && npx @vscode/vsce package`)

   This generates a `code-cloak-0.1.0.vsix` file in the project root.

2. **In Cursor** (or VS Code), choose one of the options:

   **Option A — Drag and drop**
   - Open the Extensions panel: `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Drag the `.vsix` file into the panel

   **Option B — Command Palette**
   - `Ctrl+Shift+P` (or `Cmd+Shift+P`) → type **Extensions: Install from VSIX**
   - Select the generated `.vsix` file

   **Option C — Command line**
   ```bash
   cursor --install-extension /path/to/code-cloak-0.1.0.vsix
   ```

3. Close and reopen Cursor for the extension to load.

### Development mode

1. Clone the repo: `git clone <repo-url> && cd code-cloak`
2. Run `npm install && npm run compile`
3. Press **F5** in VS Code to launch the Extension Development Host with the extension loaded

---

## Commands

Access all commands via the Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac), then type `CodeCloak`.

### CodeCloak: Cloak & Copy

**What it does:** Transforms the selected code (anonymizes variables and strings) and copies the result to the clipboard.

**How to use:**
1. Select the code you want to anonymize
2. Right-click → **CodeCloak: Cloak & Copy**
3. Or use the shortcut: `Ctrl+Alt+Shift+C` / `Cmd+Alt+Shift+C`
4. Paste anywhere (e.g., into an AI chat) with `Ctrl+V` / `Cmd+V`

**Example:**

| Before | After |
|--------|-------|
| `const userName = "John";` | `const uN = "Jo";` |
| `materials.each do \|material\|` | `m.each do \|mm\|` |
| `arr.map(x => x * 2)` | `a.map(x => x * 2)` |

---

### CodeCloak: Cloak & Copy (Open in New Tab)

**What it does:** Same as Cloak & Copy, but also opens the transformed code in a new editor tab side-by-side.

**How to use:**
1. Select the code
2. Right-click → **CodeCloak: Cloak & Copy (Open in New Tab)**
3. The transformed code appears in a new tab; it's also copied to the clipboard

**When to use:** Useful when you want to review the transformed output before pasting it elsewhere, or compare original vs. anonymized code.

---

### CodeCloak: Decloak (Restore from Last Cloak)

**What it does:** Restores anonymized code using the context from the last Cloak & Copy. Use after pasting AI-refactored code back into the editor.

**How to use:**
1. First run **Cloak & Copy** on some code (this stores the mapping)
2. Paste the cloaked code into an AI chat, get refactored output
3. Paste the refactored code back into VS Code
4. Select the portion you want to restore
5. Right-click → **CodeCloak: Decloak** (or Command Palette)
6. The selection is replaced with decloaked (restored) identifiers and strings

**When to use:** After sharing code with an AI, getting refactored suggestions, and wanting to paste the result back with original variable/string names restored. Only the last cloak's context is stored.

---

### CodeCloak: Add as Keyword

**What it does:** Adds the word under the cursor as a reserved keyword for the current file's language. Reserved keywords are never transformed.

**How to use:**
1. Place the cursor on a word (e.g., a library name, custom function, or variable you want to preserve)
2. Right-click → **CodeCloak: Add as Keyword**
3. The word is added to `codeCloak.keywordsAdd` in your settings

**Example:** If you have `myInternalLib.process()` and want to keep `myInternalLib` unchanged:
1. Click on `myInternalLib`
2. Run **CodeCloak: Add as Keyword**
3. Result: `myInternalLib.process()` stays as-is; only other identifiers get transformed

---

### CodeCloak: Show Default Keywords

**What it does:** Opens a document listing all default reserved keywords by language (JavaScript, TypeScript, Ruby).

**How to use:**
1. `Ctrl+Shift+P` / `Cmd+Shift+P` → type **CodeCloak: Show Default Keywords**
2. Select a language (JavaScript, TypeScript, or Ruby)
3. A Markdown document opens with keywords grouped by category (e.g., Lodash, Array methods, Enumerable)

**When to use:** To see which words are preserved by default, or to decide what to add to `keywordsExclude` if you want certain keywords to be transformed.

---

## Abbreviation Rules

- `camelCase` → `cO` (e.g., `calculateOrder` → `cO`)
- `PascalCase` → `UP` (e.g., `UserProfile` → `UP`)
- `snake_case` → `u_p` (e.g., `user_profile` → `u_p`)
- `UPPER_SNAKE` → `A_K` (e.g., `API_KEY` → `A_K`)

Collisions are resolved with the next letter from the original name (e.g., `cO`, `cOa`, `cOb`).

## Supported Languages

- JavaScript, TypeScript, JSX, TSX
- Ruby, ERB
- GraphQL, HTML (basic)

---

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `codeCloak.preserveReactHooks` | boolean | `true` | Keep React hooks (useState, useEffect, etc.) unchanged |
| `codeCloak.stringFormat` | string | `"abbreviate"` | String anonymization: `"s1"`, `"str1"`, or `"abbreviate"` |
| `codeCloak.copyToClipboard` | boolean | `true` | Copy to clipboard after transform |
| `codeCloak.keywordsAdd` | object | `{}` | Keywords to add per language (never transformed) |
| `codeCloak.keywordsExclude` | object | `{}` | Keywords to remove from defaults (allow transformation) |
| `codeCloak.customKeywords` | object | `{}` | (Legacy) Same as keywordsAdd. Prefer keywordsAdd. |

### Example: Add custom keywords

```json
{
  "codeCloak.keywordsAdd": {
    "javascript": ["myLib", "internalHelper"],
    "ruby": ["my_model"]
  }
}
```

### Example: Remove default keywords

To allow `map` and `each` to be transformed instead of preserved:

```json
{
  "codeCloak.keywordsExclude": {
    "javascript": ["map"],
    "ruby": ["each"]
  }
}
```

### String format options

- **`abbreviate`** (default): First 2 chars of each word — `"Hello World"` → `"He Wo"`
- **`s1`**: Generic placeholder — `"Hello World"` → `"s1"`
- **`str1`**: Numbered string — `"Hello World"` → `"str1"`

---

## Keyboard Shortcut

- **Windows/Linux:** `Ctrl+Alt+Shift+C`
- **Mac:** `Cmd+Alt+Shift+C`

(Bound to **CodeCloak: Cloak & Copy**)

---

## Development

```bash
npm install
npm run compile
npm test
```

Press **F5** in VS Code to launch the Extension Development Host.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
