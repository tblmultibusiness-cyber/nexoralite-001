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
import { BrowserController, SessionManager } from '@/browser';
import { useBrowserStore } from '@/store/browserStore';

/**
 * Nexora Browser 001
 * Permanent chrome + real browser engine (BrowseSurface / Capgo WebView).
 */
export default function App() {
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
        setCurrentUrl(event.url);
        syncFromSession();
      }
      if (event.type === 'closed') {
        setCurrentUrl('');
        setShowHome(true);
        syncFromSession();
      }
      if (event.type === 'pageLoaded') {
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
      <header className="shrink-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="pt-[env(safe-area-inset-top)]">
          <AddressBar currentUrl={currentUrl} />
        </div>
      </header>

      <main className="flex-1 min-h-0 relative">
        {showHome || !currentUrl ? (
          <HomeScreen />
        ) : (
          <BrowseSurface url={currentUrl} />
        )}
      </main>

      <footer className="shrink-0 z-20">
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
