/**
 * Navigator
 * ---------
 * The ONLY public entry point for browsing in Nexora Browser 001.
 *
 * Every button, every address-bar submit, every link the user taps
 * must go through this file.
 *
 * Guarantee: content stays inside the app.
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
  /** Set the active search engine */
  setSearchEngine(engine: SearchEngine) {
    currentEngine = engine;
  },

  getSearchEngine() {
    return currentEngine;
  },

  /**
   * Main navigation method.
   * Accepts either a full URL or a search query.
   * Everything ends up inside the app WebView.
   */
  async go(input: string): Promise<void> {
    const finalUrl = resolveInput(input, currentEngine);
    if (!finalUrl) return;

    // Update session first
    SessionManager.updateActiveTab(finalUrl);
    SessionManager.pushHistory(finalUrl);

    // Load inside the single controlled WebView
    await BrowserController.navigate(finalUrl);
  },

  /** Open a brand-new tab and navigate */
  async newTab(input = ''): Promise<void> {
    const finalUrl = input ? resolveInput(input, currentEngine) : '';
    SessionManager.createTab(finalUrl || '');
    if (finalUrl) {
      await BrowserController.navigate(finalUrl);
    }
  },

  async back(): Promise<void> {
    const url = SessionManager.moveBack();
    if (url === '') {
      // Returned to empty state (home)
      await BrowserController.close();
      return;
    }
    if (url) {
      await BrowserController.navigate(url);
    }
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

  /** Current URL the user is looking at */
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
