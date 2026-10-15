import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { SessionManager, Navigator, BrowserController } from '@/browser';
import { useBrowserStore } from '@/store/browserStore';

export function TabsOverview() {
  const { showTabs, setShowTabs, tabs, refreshTabs, syncFromSession } = useBrowserStore();

  const closeTab = async (id: string) => {
    SessionManager.closeTab(id);
    refreshTabs();
    syncFromSession();
    const active = SessionManager.getActiveTab();
    if (active.url) {
      await BrowserController.navigate(active.url);
    } else {
      await BrowserController.close();
    }
  };

  const switchTo = async (id: string) => {
    SessionManager.switchTab(id);
    const tab = SessionManager.getActiveTab();
    syncFromSession();
    setShowTabs(false);
    if (tab.url) {
      await BrowserController.navigate(tab.url);
    } else {
      await BrowserController.close();
    }
  };

  const newTab = async () => {
    await Navigator.newTab();
    refreshTabs();
    syncFromSession();
    setShowTabs(false);
  };

  return (
    <AnimatePresence>
      {showTabs && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border pt-[env(safe-area-inset-top)]">
            <h2 className="text-base font-semibold">Tabs</h2>
            <button
              onClick={() => setShowTabs(false)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`relative rounded-xl border p-3 flex flex-col gap-2 min-h-[100px] ${
                  tab.isActive ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}
              >
                <button
                  onClick={() => switchTo(tab.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-medium truncate">{tab.title || 'New Tab'}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-1">
                    {tab.url ? tab.url.replace(/^https?:\/\//, '') : 'Empty'}
                  </p>
                </button>
                {tabs.length > 1 && (
                  <button
                    onClick={() => closeTab(tab.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
                    aria-label="Close tab"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={newTab}
              className="rounded-xl border border-dashed border-border p-3 min-h-[100px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs">New Tab</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
