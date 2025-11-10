import { DEBUG as ENV_DEBUG } from '@env';

// Determine debug mode: prefer explicit env var, fall back to React Native __DEV__
export const DEBUG: boolean = (() => {
  if (typeof ENV_DEBUG === 'string') {
    const v = ENV_DEBUG.trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes';
  }

  return typeof __DEV__ !== 'undefined' ? __DEV__ : false;
})();

export const logDebug = (...args: unknown[]) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG]', ...args);
  }
};

export const errorDebug = (...args: unknown[]) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.error('[DEBUG]', ...args);
  }
};
