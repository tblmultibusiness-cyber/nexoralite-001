import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Languages, Shield } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';

interface AIPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AIPanel({ open, onClose }: AIPanelProps) {
  const { currentUrl } = useBrowserStore();

  const actions = [
    {
      icon: FileText,
      title: 'Summarize page',
      desc: currentUrl ? 'Get key points from this page' : 'Open a page first',
      disabled: !currentUrl,
    },
    {
      icon: Languages,
      title: 'Translate',
      desc: 'Yoruba · English · Pidgin',
      disabled: !currentUrl,
    },
    {
      icon: Shield,
      title: 'Privacy check',
      desc: 'Trackers and data usage',
      disabled: !currentUrl,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card border-t border-border pb-[env(safe-area-inset-bottom)] max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Nexora AI</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="px-4 text-xs text-muted-foreground mb-3">
              Your companion stays inside the app. No external AI windows.
            </p>

            <div className="px-4 pb-4 space-y-2">
              {actions.map((a) => (
                <button
                  key={a.title}
                  disabled={a.disabled}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border text-left disabled:opacity-40 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <a.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
