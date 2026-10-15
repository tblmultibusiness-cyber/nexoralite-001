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
  showHistory: boolean;
  showBookmarks: boolean;
  showSettings: boolean;
  showAI: boolean;
  showPrivacy: boolean;

  setCurrentUrl: (url: string) => void;
  setShowHome: (v: boolean) => void;
  refreshTabs: () => void;
  setCanGoBack: (v: boolean) => void;
  setCanGoForward: (v: boolean) => void;
  setShowTabs: (v: boolean) => void;
  setShowMenu: (v: boolean) => void;
  setShowHistory: (v: boolean) => void;
  setShowBookmarks: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setShowAI: (v: boolean) => void;
  setShowPrivacy: (v: boolean) => void;
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
  showHistory: false,
  showBookmarks: false,
  showSettings: false,
  showAI: false,
  showPrivacy: false,

  setCurrentUrl: (url) => set({ currentUrl: url, showHome: !url }),
  setShowHome: (v) => set({ showHome: v }),
  refreshTabs: () => set({ tabs: SessionManager.getTabs() }),
  setCanGoBack: (v) => set({ canGoBack: v }),
  setCanGoForward: (v) => set({ canGoForward: v }),
  setShowTabs: (v) => set({ showTabs: v }),
  setShowMenu: (v) => set({ showMenu: v }),
  setShowHistory: (v) => set({ showHistory: v }),
  setShowBookmarks: (v) => set({ showBookmarks: v }),
  setShowSettings: (v) => set({ showSettings: v }),
  setShowAI: (v) => set({ showAI: v }),
  setShowPrivacy: (v) => set({ showPrivacy: v }),
  syncFromSession: () =>
    set({
      tabs: SessionManager.getTabs(),
      currentUrl: SessionManager.getCurrentUrl(),
      showHome: !SessionManager.getCurrentUrl(),
      canGoBack: SessionManager.canGoBack(),
      canGoForward: SessionManager.canGoForward(),
    }),
}));
