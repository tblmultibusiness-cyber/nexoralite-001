import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Clock,
  Settings,
  Shield,
  Download,
  Share2,
  EyeOff,
} from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { SessionManager } from '@/browser';

export function MenuSheet() {
  const { showMenu, setShowMenu } = useBrowserStore();

  const items = [
    { icon: BookOpen, label: 'Bookmarks', action: () => {} },
    { icon: Clock, label: 'History', action: () => {} },
    { icon: Download, label: 'Downloads', action: () => {} },
    {
      icon: EyeOff,
      label: SessionManager.isIncognito() ? 'Exit Incognito' : 'Incognito',
      action: () => {
        SessionManager.setIncognito(!SessionManager.isIncognito());
        setShowMenu(false);
      },
    },
    { icon: Share2, label: 'Share', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: Shield, label: 'Privacy', action: () => {} },
  ];

  return (
    <AnimatePresence>
      {showMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowMenu(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card border-t border-border pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold">Menu</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 px-4 pb-4">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted active:scale-95 transition-transform"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
