import { useEffect } from 'react';
import { AddressBar } from '@/components/chrome/AddressBar';
import { BottomToolbar } from '@/components/chrome/BottomToolbar';
import { HomeScreen } from '@/components/chrome/HomeScreen';
import { BrowseSurface } from '@/components/chrome/BrowseSurface';
import { TabsOverview } from '@/components/chrome/TabsOverview';
import { MenuSheet } from '@/components/chrome/MenuSheet';
import { HistoryScreen } from '@/components/chrome/HistoryScreen';
import { BookmarksScreen } from '@/components/chrome/BookmarksScreen';
import { SettingsScreen } from '@/components/chrome/SettingsScreen';
import { PrivacyScreen } from '@/components/chrome/PrivacyScreen';
import { AIOrb } from '@/components/chrome/AIOrb';
import { AIPanel } from '@/components/chrome/AIPanel';
import { TopMenu } from '@/components/chrome/TopMenu';
import { IncognitoBanner } from '@/components/chrome/IncognitoBanner';
import { BrowserController, SessionManager } from '@/browser';
import { useBrowserStore } from '@/store/browserStore';
import { useBrowserLayout } from '@/hooks/useBrowserLayout';

export default function App() {
  const { headerRef, footerRef } = useBrowserLayout();

  const {
    currentUrl,
    showHome,
    tabs,
    canGoBack,
    canGoForward,
    showHistory,
    showBookmarks,
    showSettings,
    showAI,
    showPrivacy,
    setCurrentUrl,
    setShowHome,
    refreshTabs,
    setShowTabs,
    setShowMenu,
    setShowHistory,
    setShowBookmarks,
    setShowSettings,
    setShowAI,
    setShowPrivacy,
    syncFromSession,
  } = useBrowserStore();

  useEffect(() => {
    const unsub = BrowserController.subscribe((event) => {
      if (event.type === 'urlChange') {
        const prev = SessionManager.getCurrentUrl();
        if (event.url && event.url !== prev) {
          SessionManager.pushHistory(event.url);
        }
        SessionManager.updateActiveTab(event.url);
        setCurrentUrl(event.url);
        syncFromSession();
      }
      if (event.type === 'closed') {
        setCurrentUrl('');
        setShowHome(true);
        syncFromSession();
      }
      if (event.type === 'pageLoaded') {
        SessionManager.updateActiveTab(event.url);
        setCurrentUrl(event.url);
        syncFromSession();
      }
    });
    return unsub;
  }, [setCurrentUrl, setShowHome, syncFromSession]);

  const goHome = async () => {
    await BrowserController.close();
    setCurrentUrl('');
    setShowHome(true);
    SessionManager.updateActiveTab('');
    refreshTabs();
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      <header
        ref={headerRef as React.RefObject<HTMLElement>}
        className="shrink-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50"
      >
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between px-3 pt-2">
            <h1 className="text-sm font-bold">
              <span className="text-blue-400">Nexora</span>{' '}
              <span className="text-foreground">Browser</span>
            </h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowTabs(true)}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs font-semibold"
                aria-label="Tabs"
              >
                {tabs.length}
              </button>
              <TopMenu />
            </div>
          </div>
          <AddressBar currentUrl={currentUrl} />
          <IncognitoBanner />
        </div>
      </header>

      <main className="flex-1 min-h-0 relative">
        {showHome || !currentUrl ? (
          <HomeScreen />
        ) : (
          <BrowseSurface url={currentUrl} />
        )}
      </main>

      <footer ref={footerRef as React.RefObject<HTMLElement>} className="shrink-0 z-20">
        <BottomToolbar
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          tabCount={tabs.length}
          onHome={goHome}
          onTabs={() => setShowTabs(true)}
          onMenu={() => setShowMenu(true)}
        />
      </footer>

      <AIOrb onOpen={() => setShowAI(true)} />

      <TabsOverview />
      <MenuSheet />
      <HistoryScreen open={showHistory} onClose={() => setShowHistory(false)} />
      <BookmarksScreen open={showBookmarks} onClose={() => setShowBookmarks(false)} />
      <SettingsScreen open={showSettings} onClose={() => setShowSettings(false)} />
      <PrivacyScreen open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <AIPanel open={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}
