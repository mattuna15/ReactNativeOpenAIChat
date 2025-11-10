# Linting and Code Quality Setup

This project includes comprehensive linting and code quality tools to ensure consistent code style and catch potential issues early.

## Tools Configured

### ESLint

- **Configuration**: `.eslintrc.js`
- **TypeScript support**: Enabled with `@typescript-eslint/parser`
- **React/React Native rules**: Enabled for component best practices
- **Custom rules**: Added for code quality, formatting, and React Native specific patterns

### Prettier

- **Configuration**: Uses `.prettierrc.js` for consistent formatting
- **Integration**: Works alongside ESLint for code formatting

### Husky & Lint-staged

- **Pre-commit hooks**: Automatically runs linting and formatting before commits
- **Staged files only**: Only processes files in the git staging area

## Available Scripts

### Linting

```bash
# Run eslint on all files
npm run lint

# Run eslint with auto-fix
npm run lint:fix

# Run eslint with strict mode (max-warnings 0)
npm run lint:check
```

### Type Checking

```bash
# Run TypeScript compiler without emitting files
npm run type-check
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Validation

```bash
# Run all checks (lint, type-check, format-check, test)
npm run validate

# Pre-commit validation (lint-check, type-check, test)
npm run prepare
```

### Cleaning

```bash
# Clean and reinstall dependencies
npm run clean

# Clean iOS build
npm run clean:ios

# Clean Android build
npm run clean:android
```

## ESLint Rules Configured

### TypeScript Rules

- `@typescript-eslint/no-unused-vars`: Error for unused variables
- `@typescript-eslint/no-explicit-any`: Warning for explicit any types
- `@typescript-eslint/no-empty-function`: Warning for empty functions

### React Rules

- `react/prop-types`: Disabled (using TypeScript)
- `react/react-in-jsx-scope`: Disabled (not needed in RN)
- `react/display-name`: Warning for missing display names

### React Hooks Rules

- `react-hooks/rules-of-hooks`: Error for hook violations
- `react-hooks/exhaustive-deps`: Warning for missing dependencies

### React Native Rules

- `react-native/no-unused-styles`: Error for unused styles
- `react-native/no-inline-styles`: Warning for inline styles
- `react-native/no-color-literals`: Warning for color literals
- `react-native/split-platform-components`: Warning for platform splits

### Code Quality Rules

- `no-console`: Warning for console statements
- `no-debugger`: Error for debugger statements
- `prefer-const`: Error for let that should be const
- `no-var`: Error for var usage

### Style Rules

- `quotes`: Single quotes required
- `semi`: Semicolons required
- `comma-dangle`: Trailing commas in multiline
- `indent`: 2 spaces indentation
- `eol-last`: Newline required at end of file

## Current Warnings

The linting currently shows warnings for:

1. **Inline styles**: Consider moving to StyleSheet objects
2. **Color literals**: Consider using a color palette/theme system
3. **Console statements**: Should be removed in production

## Recommendations

### For Inline Styles

Instead of:

```tsx
<View style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}>
```

Consider:

```tsx
// In styles file
const dynamicStyles = (isDarkMode: boolean) => ({
  container: {
    backgroundColor: isDarkMode ? colors.dark.background : colors.light.background,
  },
});
```

### For Color Literals

Create a color theme system:

```tsx
// colors.ts
export const colors = {
  primary: '#007AFF',
  light: {
    background: '#fff',
    text: '#000',
  },
  dark: {
    background: '#000',
    text: '#fff',
  },
};
```

### For Console Statements

Use a proper logging solution or remove debug statements:

```tsx
// Instead of console.error
if (__DEV__) {
  console.error('Development only error:', error);
}
```

## Git Hooks

Pre-commit hooks automatically:

1. Run ESLint with auto-fix on staged files
2. Run Prettier on staged files
3. Prevent commit if there are unfixable errors

## IDE Integration

VSCode settings are configured in `.vscode/settings.json` to:

- Auto-format on save
- Run ESLint auto-fix on save
- Organize imports on save
- Use proper TypeScript settings
