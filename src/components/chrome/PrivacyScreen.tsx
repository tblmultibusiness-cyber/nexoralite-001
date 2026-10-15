import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Eye, Lock, Ban } from 'lucide-react';

interface PrivacyScreenProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyScreen({ open, onClose }: PrivacyScreenProps) {
  const points = [
    {
      icon: Ban,
      title: 'No system browser',
      desc: 'Chrome Custom Tabs and Safari view controllers are never used.',
    },
    {
      icon: Lock,
      title: 'Single WebView',
      desc: 'All pages load in one controlled surface owned by Nexora.',
    },
    {
      icon: Eye,
      title: 'Incognito mode',
      desc: 'History is not saved while Incognito is on.',
    },
    {
      icon: Shield,
      title: 'Local first',
      desc: 'Bookmarks and settings stay on your device.',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Privacy</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              Nexora is designed so browsing never leaves the app.
            </p>
            {points.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
