/**
 * Navigator — only public entry for browsing
 * All paths end in BrowserController (in-app WebView only).
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

  async go(input: string): Promise<void> {
    const finalUrl = resolveInput(input, currentEngine);
    if (!finalUrl) return;

    SessionManager.updateActiveTab(finalUrl);
    SessionManager.pushHistory(finalUrl);
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
    // Prefer native WebView history (real page back)
    const usedNative = await BrowserController.goBack();
    if (usedNative) return;

    // Fallback: app session history
    const url = SessionManager.moveBack();
    if (url === '' || url === null) {
      await BrowserController.close();
      return;
    }
    await BrowserController.navigate(url);
  },

  async forward(): Promise<void> {
    const url = SessionManager.moveForward();
    if (url) await BrowserController.navigate(url);
  },

  async reload(): Promise<void> {
    await BrowserController.reload();
  },

  getCurrentUrl(): string {
    return SessionManager.getCurrentUrl();
  },

  canGoBack(): boolean {
    return SessionManager.canGoBack() || BrowserController.isOpen();
  },

  canGoForward(): boolean {
    return SessionManager.canGoForward();
  },
};
