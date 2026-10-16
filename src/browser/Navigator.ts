/**
 * Navigator — only public entry for browsing
 * All paths end in BrowserController (in-app WebView only).
 * Proxy mode (optional): rewrites URL through ProxyService before load.
 */

import { BrowserController } from './BrowserController';
import { SessionManager } from './SessionManager';
import { resolveInput, type SearchEngine } from './NavigationService';
import { ProxyService } from './ProxyService';

const DEFAULT_ENGINE: SearchEngine = {
  id: 'google',
  name: 'Google',
  searchUrl: 'https://www.google.com/search?q=',
};

let currentEngine: SearchEngine = DEFAULT_ENGINE;

function loadUrl(finalUrl: string): Promise<void> {
  // Session keeps the real site URL; WebView may load proxied URL
  const target = ProxyService.apply(finalUrl);
  return BrowserController.navigate(target);
}

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
    await loadUrl(finalUrl);
  },

  async newTab(input = ''): Promise<void> {
    const finalUrl = input ? resolveInput(input, currentEngine) : '';
    SessionManager.createTab(finalUrl || '');
    if (finalUrl) {
      await loadUrl(finalUrl);
    } else {
      await BrowserController.close();
    }
  },

  async back(): Promise<void> {
    const usedNative = await BrowserController.goBack();
    if (usedNative) return;

    const url = SessionManager.moveBack();
    if (url === '' || url === null) {
      await BrowserController.close();
      return;
    }
    await loadUrl(url);
  },

  async forward(): Promise<void> {
    const url = SessionManager.moveForward();
    if (url) await loadUrl(url);
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
