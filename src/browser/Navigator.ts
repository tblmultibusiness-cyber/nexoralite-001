/**
 * Navigator — ONLY public entry for browsing
 *
 * AGREEMENT:
 * Everything works inside the app.
 * No system browser. No window.open. No external tabs.
 * Every go / back / forward / newTab ends in BrowserController.
 */

import { BrowserController } from './BrowserController';
import { SessionManager } from './SessionManager';
import { resolveInput, type SearchEngine } from './NavigationService';

const DEFAULT_ENGINE: SearchEngine = {
  id: 'google',
  name: 'Google',
  searchUrl: 'https://www.google.com/search?q=',
};

let currentEngine: SearchEngine = DEFAULT_ENGINE;

export const Navigator = {
  setSearchEngine(engine: SearchEngine) {
    currentEngine = engine;
  },

  getSearchEngine() {
    return currentEngine;
  },

  /**
   * Load anything the user typed or tapped — inside the app only.
   */
  async go(input: string): Promise<void> {
    const finalUrl = resolveInput(input, currentEngine);
    if (!finalUrl) return;

    SessionManager.updateActiveTab(finalUrl);
    SessionManager.pushHistory(finalUrl);

    // Single path into the engine — never leaves the app
    await BrowserController.navigate(finalUrl);
  },

  async newTab(input = ''): Promise<void> {
    const finalUrl = input ? resolveInput(input, currentEngine) : '';
    SessionManager.createTab(finalUrl || '');
    if (finalUrl) {
      await BrowserController.navigate(finalUrl);
    } else {
      await BrowserController.close();
    }
  },

  async back(): Promise<void> {
    const url = SessionManager.moveBack();
    if (url === '' || url === null) {
      await BrowserController.close();
      return;
    }
    await BrowserController.navigate(url);
  },

  async forward(): Promise<void> {
    const url = SessionManager.moveForward();
    if (url) {
      await BrowserController.navigate(url);
    }
  },

  async reload(): Promise<void> {
    await BrowserController.reload();
  },

  getCurrentUrl(): string {
    return SessionManager.getCurrentUrl();
  },

  canGoBack(): boolean {
    return SessionManager.canGoBack();
  },

  canGoForward(): boolean {
    return SessionManager.canGoForward();
  },
};
