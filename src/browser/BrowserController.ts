/**
 * BrowserController — THE ENGINE
 * Loads every page inside Nexora.
 * Native: Capgo managed WebView only (never system browser).
 * Web: drives the in-app iframe surface (BrowseSurface).
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
  private listeners = new Set<BrowserListener>();
  private currentUrl = '';
  private isOpenFlag = false;
  private isNative = Capacitor.isNativePlatform();
  private listenersAttached = false;

  subscribe(listener: BrowserListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: BrowserEvent) {
    this.listeners.forEach((l) => l(event));
  }

  private async attachNativeListeners() {
    if (this.listenersAttached || !this.isNative) return;
    this.listenersAttached = true;
    try {
      await InAppBrowser.addListener('urlChangeEvent', (ev: { url: string }) => {
        if (ev?.url) {
          this.currentUrl = ev.url;
          this.emit({ type: 'urlChange', url: ev.url });
        }
      });
      await InAppBrowser.addListener('browserPageLoaded', () => {
        this.emit({ type: 'pageLoaded', url: this.currentUrl });
      });
      await InAppBrowser.addListener('closeEvent', () => {
        this.isOpenFlag = false;
        this.emit({ type: 'closed' });
      });
    } catch (e) {
      console.warn('[BrowserController] listeners', e);
    }
  }

  /** Load URL inside the app. This is the engine entry point. */
  async navigate(url: string): Promise<void> {
    if (!url) return;
    if (/^(javascript|data|vbscript):/i.test(url)) {
      console.warn('[BrowserController] blocked', url);
      return;
    }

    this.currentUrl = url;
    this.emit({ type: 'urlChange', url });

    if (this.isNative) {
      await this.attachNativeListeners();
      try {
        if (this.isOpenFlag) {
          try { await InAppBrowser.close(); } catch { /* ignore */ }
        }
        await InAppBrowser.openWebView({
          url,
          toolbarType: ToolBarType.NAVIGATION,
          showReloadButton: true,
          shareSubject: 'Shared from Nexora',
          toolbarColor: '#0b0f1a',
          toolbarTextColor: '#e2e8f0',
          showArrow: true,
          isPresentAfterPageLoad: false,
        });
        this.isOpenFlag = true;
        this.emit({ type: 'pageLoaded', url });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.emit({ type: 'pageError', url, error: message });
      }
      return;
    }

    // Web: BrowseSurface iframe will pick up currentUrl from the store/events
    this.isOpenFlag = true;
    this.emit({ type: 'pageLoaded', url });
  }

  async goBack(): Promise<void> {
    console.info('[BrowserController] goBack');
  }

  async goForward(): Promise<void> {
    console.info('[BrowserController] goForward');
  }

  async reload(): Promise<void> {
    if (this.currentUrl) await this.navigate(this.currentUrl);
  }

  async close(): Promise<void> {
    if (this.isNative && this.isOpenFlag) {
      try { await InAppBrowser.close(); } catch { /* ignore */ }
    }
    this.isOpenFlag = false;
    this.currentUrl = '';
    this.emit({ type: 'closed' });
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  isOpen(): boolean {
    return this.isOpenFlag;
  }
}

export const BrowserController = new BrowserControllerImpl();
