import { create } from 'zustand';
import { SessionManager, type Tab } from '@/browser';

interface BrowserState {
  currentUrl: string;
  showHome: boolean;
  tabs: Tab[];
  canGoBack: boolean;
  canGoForward: boolean;
  showTabs: boolean;
  showMenu: boolean;

  setCurrentUrl: (url: string) => void;
  setShowHome: (v: boolean) => void;
  refreshTabs: () => void;
  setCanGoBack: (v: boolean) => void;
  setCanGoForward: (v: boolean) => void;
  setShowTabs: (v: boolean) => void;
  setShowMenu: (v: boolean) => void;
  syncFromSession: () => void;
}

export const useBrowserStore = create<BrowserState>((set) => ({
  currentUrl: '',
  showHome: true,
  tabs: SessionManager.getTabs(),
  canGoBack: false,
  canGoForward: false,
  showTabs: false,
  showMenu: false,

  setCurrentUrl: (url) => set({ currentUrl: url, showHome: !url }),
  setShowHome: (v) => set({ showHome: v }),
  refreshTabs: () => set({ tabs: SessionManager.getTabs() }),
  setCanGoBack: (v) => set({ canGoBack: v }),
  setCanGoForward: (v) => set({ canGoForward: v }),
  setShowTabs: (v) => set({ showTabs: v }),
  setShowMenu: (v) => set({ showMenu: v }),
  syncFromSession: () =>
    set({
      tabs: SessionManager.getTabs(),
      currentUrl: SessionManager.getCurrentUrl(),
      showHome: !SessionManager.getCurrentUrl(),
      canGoBack: SessionManager.canGoBack(),
      canGoForward: SessionManager.canGoForward(),
    }),
}));
