/**
 * SessionManager
 * --------------
 * Owns all browsing session state.
 * Tabs, history, current URL, incognito.
 * Works together with BrowserController.
 */

export interface Tab {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
}

class SessionManagerImpl {
  private tabs: Tab[] = [
    { id: '1', url: '', title: 'New Tab', isActive: true },
  ];
  private activeTabId = '1';
  private historyStack: string[] = [];
  private historyIndex = -1;
  private browsingHistory: HistoryEntry[] = [];
  private incognito = false;

  getTabs(): Tab[] {
    return [...this.tabs];
  }

  getActiveTab(): Tab {
    return this.tabs.find((t) => t.id === this.activeTabId) || this.tabs[0];
  }

  getCurrentUrl(): string {
    return this.getActiveTab().url;
  }

  createTab(url = ''): Tab {
    const newTab: Tab = {
      id: Date.now().toString(),
      url,
      title: url ? this.hostname(url) : 'New Tab',
      isActive: true,
    };
    this.tabs = this.tabs.map((t) => ({ ...t, isActive: false })).concat(newTab);
    this.activeTabId = newTab.id;
    if (url) this.pushHistory(url);
    return newTab;
  }

  closeTab(id: string): void {
    if (this.tabs.length === 1) {
      this.tabs = [{ id: '1', url: '', title: 'New Tab', isActive: true }];
      this.activeTabId = '1';
      this.historyStack = [];
      this.historyIndex = -1;
      return;
    }
    const idx = this.tabs.findIndex((t) => t.id === id);
    this.tabs = this.tabs.filter((t) => t.id !== id);
    if (id === this.activeTabId) {
      const newIdx = Math.min(idx, this.tabs.length - 1);
      this.tabs[newIdx].isActive = true;
      this.activeTabId = this.tabs[newIdx].id;
    }
  }

  switchTab(id: string): void {
    this.tabs = this.tabs.map((t) => ({ ...t, isActive: t.id === id }));
    this.activeTabId = id;
  }

  updateActiveTab(url: string, title?: string): void {
    this.tabs = this.tabs.map((t) =>
      t.id === this.activeTabId
        ? { ...t, url, title: title || this.hostname(url) || 'New Tab' }
        : t
    );
  }

  pushHistory(url: string): void {
    this.historyStack = this.historyStack.slice(0, this.historyIndex + 1).concat(url);
    this.historyIndex = this.historyStack.length - 1;

    if (!this.incognito) {
      this.browsingHistory = [
        {
          id: Date.now().toString(),
          url,
          title: this.hostname(url),
          visitedAt: Date.now(),
        },
        ...this.browsingHistory,
      ].slice(0, 150);
    }
  }

  canGoBack(): boolean {
    return this.historyIndex > 0 || !!this.getCurrentUrl();
  }

  canGoForward(): boolean {
    return this.historyIndex < this.historyStack.length - 1;
  }

  getBackUrl(): string | null {
    if (this.historyIndex > 0) {
      return this.historyStack[this.historyIndex - 1];
    }
    return null;
  }

  getForwardUrl(): string | null {
    if (this.historyIndex < this.historyStack.length - 1) {
      return this.historyStack[this.historyIndex + 1];
    }
    return null;
  }

  moveBack(): string | null {
    if (this.historyIndex > 0) {
      this.historyIndex -= 1;
      const url = this.historyStack[this.historyIndex];
      this.updateActiveTab(url);
      return url;
    }
    // Go to empty new-tab state
    this.updateActiveTab('');
    return '';
  }

  moveForward(): string | null {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex += 1;
      const url = this.historyStack[this.historyIndex];
      this.updateActiveTab(url);
      return url;
    }
    return null;
  }

  setIncognito(enabled: boolean): void {
    this.incognito = enabled;
  }

  isIncognito(): boolean {
    return this.incognito;
  }

  getBrowsingHistory(): HistoryEntry[] {
    return [...this.browsingHistory];
  }

  clearBrowsingHistory(): void {
    this.browsingHistory = [];
  }

  private hostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
}

export const SessionManager = new SessionManagerImpl();
