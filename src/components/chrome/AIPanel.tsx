import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Languages, MessageCircle, Mic } from 'lucide-react';
import { Navigator } from '@/browser';

interface AIPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AIPanel({ open, onClose }: AIPanelProps) {
  const openInApp = async (url: string) => {
    onClose();
    await Navigator.go(url);
  };

  const tools = [
    {
      icon: Sparkles,
      title: 'Google AI Mode',
      desc: 'Search and ask',
      action: () => openInApp('https://www.google.com/search?q=&udm=50'),
    },
    {
      icon: Languages,
      title: 'Translate',
      desc: 'Language tools',
      action: () => openInApp('https://translate.google.com'),
    },
    {
      icon: MessageCircle,
      title: 'ChatGPT',
      desc: 'Open ChatGPT',
      action: () => openInApp('https://chatgpt.com'),
    },
    {
      icon: Mic,
      title: 'Voice search',
      desc: 'Speak a query',
      action: () => openInApp('https://www.google.com'),
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
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card border-t border-border pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold">AI tools</h3>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 pb-5">
              {tools.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  onClick={t.action}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl border border-border bg-muted/30 text-left active:scale-[0.98] transition-transform"
                >
                  <t.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="px-4 pb-4 text-[11px] text-muted-foreground text-center">
              Opens inside Nexora — never leaves the app
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
