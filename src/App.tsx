import { useEffect, useState } from 'react';
import { AddressBar } from '@/components/chrome/AddressBar';
import { BottomToolbar } from '@/components/chrome/BottomToolbar';
import { HomeScreen } from '@/components/chrome/HomeScreen';
import { BrowserController, SessionManager, Navigator } from '@/browser';

/**
 * Nexora Browser 001
 * ------------------
 * Permanent React chrome.
 * One controlled native WebView for all browsing.
 * User never leaves the app.
 */
export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [showHome, setShowHome] = useState(true);
  const [tabCount, setTabCount] = useState(1);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Keep UI in sync with BrowserController events
  useEffect(() => {
    const unsub = BrowserController.subscribe((event) => {
      if (event.type === 'urlChange') {
        setCurrentUrl(event.url);
        setShowHome(!event.url);
        setCanGoBack(Navigator.canGoBack());
        setCanGoForward(Navigator.canGoForward());
        setTabCount(SessionManager.getTabs().length);
      }
      if (event.type === 'closed') {
        setCurrentUrl('');
        setShowHome(true);
      }
    });
    return unsub;
  }, []);

  const goHome = async () => {
    await BrowserController.close();
    setCurrentUrl('');
    setShowHome(true);
    SessionManager.updateActiveTab('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Top chrome - always present */}
      <header className="shrink-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="pt-[env(safe-area-inset-top)]">
          <AddressBar currentUrl={currentUrl} />
        </div>
      </header>

      {/* Main surface */}
      <main className="flex-1 min-h-0 relative">
        {showHome ? (
          <HomeScreen />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            {/* On native the real WebView is managed by BrowserController.
                This placeholder keeps the React tree stable while the native surface is visible. */}
            <div className="text-center px-6">
              <p className="text-sm text-muted-foreground mb-1">Browsing inside Nexora</p>
              <p className="text-xs text-muted-foreground/70 truncate max-w-xs">{currentUrl}</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom chrome - always present */}
      <footer className="shrink-0 z-20">
        <BottomToolbar
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          tabCount={tabCount}
          onHome={goHome}
          onTabs={() => {
            // Tab overview will be added next
          }}
          onMenu={() => {
            // Menu will be added next
          }}
        />
      </footer>
    </div>
  );
}
