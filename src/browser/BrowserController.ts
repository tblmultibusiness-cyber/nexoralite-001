/**
 * BrowserController
 * -----------------
 * Owns the single persistent native WebView for Nexora Browser 001.
 *
 * Design rules:
 * - Exactly one managed WebView for the whole browsing session.
 * - Never opens the system browser / Custom Tabs / SFSafariViewController.
 * - React chrome stays around this surface forever.
 * - All navigation goes through this controller.
 */

import { Capacitor } from '@capacitor/core';
import { InAppBrowser, ToolBarType } from '@capgo/inappbrowser';

export type BrowserEvent =
  | { type: 'urlChange'; url: string }
  | { type: 'pageLoaded'; url: string }
  | { type: 'pageError'; url: string; error: string }
  | { type: 'closed' };

export type BrowserListener = (event: BrowserEvent) => void;

class BrowserControllerImpl {
  private webViewId: string | null = null;
  private currentUrl = '';
  private listeners = new Set<BrowserListener>();
  private isNative = Capacitor.isNativePlatform();

  /** Subscribe to navigation / lifecycle events */
  subscribe(listener: BrowserListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: BrowserEvent) {
    this.listeners.forEach((l) => l(event));
  }

  /** Open or reuse the single managed WebView and load a URL */
  async navigate(url: string): Promise<void> {
    if (!url) return;

    this.currentUrl = url;

    if (!this.isNative) {
      // Web fallback: still keep everything inside the same origin if possible.
      // In production we will use a full-screen iframe or a dedicated route.
      // For now we log and keep the URL in state so the UI stays consistent.
      console.info('[BrowserController] web navigate', url);
      this.emit({ type: 'urlChange', url });
      return;
    }

    // Native path — always use openWebView (never system browser)
    if (this.webViewId) {
      // Future: if the plugin supports navigate-in-place we will use it.
      // For now we re-open the same style of managed WebView.
      // Capgo allows us to keep control and avoid system browser.
      await this.close();
    }

    const result = await InAppBrowser.openWebView({
      url,
      toolbarType: ToolBarType.NAVIGATION,
      showReloadButton: true,
      shareSubject: 'Shared from Nexora',
      toolbarColor: '#0b0f1a',          // deep blue matching brand
      toolbarTextColor: '#e2e8f0',
      showArrow: true,
      isPresentAfterPageLoad: false,
      // We will later move this WebView behind React chrome with toBack / updateDimensions
    });

    // Capgo returns an id for the managed webview in newer versions
    // @ts-expect-error — id may be present depending on plugin version
    this.webViewId = result?.id ?? 'primary';

    this.emit({ type: 'urlChange', url });
  }

  async goBack(): Promise<void> {
    // Will be wired to native history once we have stable event listeners
    console.info('[BrowserController] goBack');
  }

  async goForward(): Promise<void> {
    console.info('[BrowserController] goForward');
  }

  async reload(): Promise<void> {
    if (this.currentUrl) {
      await this.navigate(this.currentUrl);
    }
  }

  async close(): Promise<void> {
    if (this.isNative) {
      try {
        await InAppBrowser.close();
      } catch {
        // already closed
      }
    }
    this.webViewId = null;
    this.emit({ type: 'closed' });
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  isOpen(): boolean {
    return this.webViewId !== null;
  }
}

/** Singleton instance used by the whole app */
export const BrowserController = new BrowserControllerImpl();
