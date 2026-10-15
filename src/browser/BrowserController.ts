/**
 * BrowserController
 * -----------------
 * Owns the SINGLE persistent native WebView for Nexora Browser 001.
 *
 * HARD RULE:
 * Everything the user browses stays inside the app.
 * Never open the system browser, Chrome Custom Tabs, or SFSafariViewController.
 * Never call window.open.
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
  private currentUrl = '';
  private listeners = new Set<BrowserListener>();
  private isNative = Capacitor.isNativePlatform();
  private isOpenFlag = false;

  /** Subscribe to navigation / lifecycle events */
  subscribe(listener: BrowserListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: BrowserEvent) {
    this.listeners.forEach((l) => l(event));
  }

  /**
   * Load a URL inside Nexora.
   * This is the ONLY way content is shown to the user.
   */
  async navigate(url: string): Promise<void> {
    if (!url) return;

    // Safety: never allow javascript: or data: schemes that could escape
    if (/^(javascript|data|vbscript):/i.test(url)) {
      console.warn('[BrowserController] blocked dangerous scheme', url);
      return;
    }

    this.currentUrl = url;
    this.emit({ type: 'urlChange', url });

    if (!this.isNative) {
      // Web build: we keep the URL in state.
      // Later we will render a full-screen controlled surface.
      // We deliberately do NOT call window.open.
      console.info('[BrowserController] web navigate (stays in app)', url);
      this.isOpenFlag = true;
      return;
    }

    // Native: always use managed WebView (never system browser)
    try {
      // Close previous instance if any so we keep exactly one
      if (this.isOpenFlag) {
        try {
          await InAppBrowser.close();
        } catch {
          // ignore
        }
      }

      await InAppBrowser.openWebView({
        url,
        toolbarType: ToolBarType.NAVIGATION,
        showReloadButton: true,
        shareSubject: 'Shared from Nexora',
        toolbarColor: '#0b0f1a',        // brand deep blue
        toolbarTextColor: '#e2e8f0',
        showArrow: true,
        isPresentAfterPageLoad: false,
        // Future: toBack + updateDimensions so React chrome stays on top
      });

      this.isOpenFlag = true;
      this.emit({ type: 'pageLoaded', url });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[BrowserController] navigate failed', message);
      this.emit({ type: 'pageError', url, error: message });
    }
  }

  async goBack(): Promise<void> {
    // Will be connected to native history events
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
    if (this.isNative && this.isOpenFlag) {
      try {
        await InAppBrowser.close();
      } catch {
        // already closed
      }
    }
    this.isOpenFlag = false;
    this.emit({ type: 'closed' });
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  isOpen(): boolean {
    return this.isOpenFlag;
  }
}

/** Singleton — the only browser surface in the entire app */
export const BrowserController = new BrowserControllerImpl();
