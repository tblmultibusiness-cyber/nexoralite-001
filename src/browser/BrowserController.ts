/**
 * BrowserController — REAL in-app engine (no placeholders)
 *
 * Capgo research:
 * - openWebView + toolbarType blank → React owns chrome
 * - x,y,width,height → WebView sits between header and footer
 * - setUrl → same WebView, no recreate
 * - goBack / reload / urlChangeEvent / browserPageLoaded / pageLoadError
 * - NEVER open() (system browser / Custom Tabs)
 */

import { Capacitor } from '@capacitor/core';
import { InAppBrowser, ToolBarType } from '@capgo/inappbrowser';

export type BrowserEvent =
  | { type: 'urlChange'; url: string }
  | { type: 'pageLoaded'; url: string }
  | { type: 'pageError'; url: string; error: string }
  | { type: 'closed' };

export type BrowserListener = (event: BrowserEvent) => void;

export interface SurfaceLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

class BrowserControllerImpl {
  private listeners = new Set<BrowserListener>();
  private currentUrl = '';
  private webViewId: string | null = null;
  private isOpenFlag = false;
  private isNative = Capacitor.isNativePlatform();
  private listenersAttached = false;
  private layout: SurfaceLayout = { x: 0, y: 120, width: 390, height: 500 };

  subscribe(listener: BrowserListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: BrowserEvent) {
    this.listeners.forEach((l) => l(event));
  }

  setLayout(layout: SurfaceLayout) {
    this.layout = layout;
    if (this.isNative && this.isOpenFlag) {
      void this.applyDimensions();
    }
  }

  private async applyDimensions() {
    try {
      await InAppBrowser.updateDimensions({
        id: this.webViewId || undefined,
        x: Math.round(this.layout.x),
        y: Math.round(this.layout.y),
        width: Math.round(this.layout.width),
        height: Math.round(this.layout.height),
      } as any);
    } catch (e) {
      console.warn('[BrowserController] updateDimensions', e);
    }
  }

  private async attachListeners() {
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
      try {
        await InAppBrowser.addListener('pageLoadError' as any, () => {
          this.emit({
            type: 'pageError',
            url: this.currentUrl,
            error: 'Page failed to load',
          });
        });
      } catch { /* older plugin */ }
      await InAppBrowser.addListener('closeEvent', () => {
        this.isOpenFlag = false;
        this.webViewId = null;
        this.emit({ type: 'closed' });
      });
    } catch (e) {
      console.warn('[BrowserController] listeners', e);
    }
  }

  async navigate(url: string): Promise<void> {
    if (!url) return;
    if (/^(javascript|data|vbscript):/i.test(url)) return;

    this.currentUrl = url;
    this.emit({ type: 'urlChange', url });

    if (!this.isNative) {
      this.isOpenFlag = true;
      this.emit({ type: 'pageLoaded', url });
      return;
    }

    await this.attachListeners();

    try {
      // Same WebView: change URL without destroying chrome layout
      if (this.isOpenFlag && typeof (InAppBrowser as any).setUrl === 'function') {
        await (InAppBrowser as any).setUrl({
          url,
          id: this.webViewId || undefined,
        });
        this.emit({ type: 'pageLoaded', url });
        return;
      }

      if (this.isOpenFlag) {
        try {
          await InAppBrowser.close();
        } catch { /* ignore */ }
        this.isOpenFlag = false;
      }

      // Blank toolbar = React chrome is the only UI
      const result = await InAppBrowser.openWebView({
        url,
        toolbarType: ToolBarType.BLANK,
        backgroundColor: 'black' as any,
        isPresentAfterPageLoad: false,
        ...({
          x: Math.round(this.layout.x),
          y: Math.round(this.layout.y),
          width: Math.round(this.layout.width),
          height: Math.round(this.layout.height),
        } as any),
      });

      this.webViewId = (result as any)?.id ?? 'primary';
      this.isOpenFlag = true;
      this.emit({ type: 'pageLoaded', url });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.emit({ type: 'pageError', url, error: message });
    }
  }

  async goBack(): Promise<boolean> {
    if (!this.isNative || !this.isOpenFlag) return false;
    try {
      if (typeof (InAppBrowser as any).goBack === 'function') {
        await (InAppBrowser as any).goBack({
          id: this.webViewId || undefined,
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  async goForward(): Promise<void> {
    // App-level history is handled by SessionManager + navigate()
  }

  async reload(): Promise<void> {
    if (this.isNative && this.isOpenFlag) {
      try {
        if (typeof (InAppBrowser as any).reload === 'function') {
          await (InAppBrowser as any).reload({
            id: this.webViewId || undefined,
          });
          return;
        }
      } catch { /* fall through */ }
    }
    if (this.currentUrl) await this.navigate(this.currentUrl);
  }

  async close(): Promise<void> {
    if (this.isNative && this.isOpenFlag) {
      try {
        await InAppBrowser.close();
      } catch { /* ignore */ }
    }
    this.isOpenFlag = false;
    this.webViewId = null;
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
