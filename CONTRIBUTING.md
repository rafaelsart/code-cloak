# Contributing to CodeCloak

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

**Requires Node.js 20+** (for `npm run package`)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd code-cloak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile and run tests**
   ```bash
   npm run compile
   npm test
   ```

4. **Development mode**
   - Press **F5** in VS Code to launch the Extension Development Host with the extension loaded
   - Or run `npm run watch` to compile on file changes

## Project Structure

- `src/` - TypeScript source
  - `extension.ts` - VS Code extension entry point
  - `transformer/` - Cloak/decloak logic
  - `parsers/` - Language parsers (JS/TS, Ruby)
  - `utils/` - Keywords and helpers

## Code Style

- Use TypeScript with strict mode
- Keep user-facing strings in English
- Add tests for new features

## Submitting Changes

1. Create a branch for your changes
2. Make your changes with clear commit messages
3. Ensure `npm run compile` and `npm test` pass
4. Open a pull request with a description of the changes
