# React Native AI Chat App

A React Native application with OpenAI integration featuring navigation between input and results screens.

A small React Native TypeScript app that sends prompts to the OpenAI Chat API and displays the assistant reply.

This README is tailored to the current project state: the app has two screens (Home and Results), theme-aware styles, keyboard-friendly input, and environment-driven configuration.

## Features

- Large multiline TextInput on the Home screen
- OpenAI Chat integration (gpt-3.5-turbo) via fetch
- Navigation: Home -> Results (React Navigation stack)
- Dark / Light theme support (colors centralized in `colors.ts`)
- Keyboard-aware UX (KeyboardAvoidingView + ScrollView + keyboardDidShow listener)
- Simple DEBUG logging gated by `DEBUG` env or `__DEV__`
- TypeScript and ESLint setup with linting scripts

## Requirements

- Node.js (16+ recommended)
- React Native CLI setup (for iOS/Android native builds)
- Xcode (for iOS) or Android Studio (for Android)

Follow the official React Native setup docs if you haven't configured native toolchains: [React Native environment setup](https://reactnative.dev/docs/environment-setup)

## Environment variables

Create a `.env` file at the project root (this repo uses `react-native-dotenv` which replaces `@env` imports at build time).

Required:

- OPENAI_API_KEY — your OpenAI API key (keep this private; do NOT commit it to git)

Optional:

- DEBUG — set to `true`, `1`, or `yes` to enable debug console logging. If not set, the app falls back to React Native's `__DEV__`.

Example `.env`:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEBUG=true
```

Security note: If you paste or commit your API key into chat or public places, consider that key compromised and rotate it immediately.

## Quick start

Install deps and run the app:

```bash
npm install
cd ios && pod install && cd ..

# start Metro
npx react-native start --reset-cache

# in a new terminal: run on iOS
npx react-native run-ios

# or run on Android
npx react-native run-android
```

If you are using the `@env` plugin (babel), remember Metro needs to be restarted after changing `.env` so the build picks up new values.

## Scripts

- npm run lint — run ESLint
- npm run lint:fix — run ESLint and auto-fix
- npm run type-check — run TypeScript compiler (noEmit)

Run type-check before committing changes:

```bash
npm run type-check
npm run lint
```

## How the app works (high-level)

- Home screen (`HomeScreen.tsx`) contains a multiline TextInput. When you tap Submit, it sends the prompt to OpenAI (via `callOpenAI`) and navigates to the Results screen with the assistant text.
- Results screen (`ResultsScreen.tsx`) displays the prompt and the assistant response. Styles are split between static and dynamic (theme-aware) files.
- Debug logs are guarded by `config.ts` (DEBUG flag). When DEBUG is enabled you'll see console logs for request payload, response status, and response body.

## Development tips

- To avoid leaking keys, add `.env` to `.gitignore` (already present in the repo). Never paste secrets into public chats or issue trackers.
- If you change `.env`, restart Metro (use --reset-cache occasionally) and re-run the app so the Babel `@env` transform picks up new values.

## Next improvements (ideas)

- Use a minimal backend proxy for OpenAI calls so API keys never ship inside the app
- Show token usage on the Results screen
- Add an in-app debug toggle to enable logging at runtime (no rebuild required)

---

If you'd like, I can update the README further to include screenshots or step-by-step troubleshooting for iOS/Android build errors.


## Troubleshooting: GUI Git clients

If GUI Git clients (like GitHub Desktop) fail Husky hooks with `npx: command not
found`, the GUI's Git process may not inherit your shell PATH. Two quick
fixes:

- Use System Git in GitHub Desktop: Preferences → Git → Use System Git.
- Install Node globally (Homebrew on macOS): `brew install node`.

Temporary workaround: commit from a terminal, or use `git commit --no-verify`
to bypass hooks (not recommended long-term).

Note: I updated the Husky pre-commit hook to run `npm run -s lint-staged` which
is more robust in some GUI environments.

