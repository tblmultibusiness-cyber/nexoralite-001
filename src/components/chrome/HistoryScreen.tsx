import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trash2 } from 'lucide-react';
import { SessionManager, Navigator } from '@/browser';
import { useState } from 'react';

interface HistoryScreenProps {
  open: boolean;
  onClose: () => void;
}

export function HistoryScreen({ open, onClose }: HistoryScreenProps) {
  const [history, setHistory] = useState(() => SessionManager.getBrowsingHistory());

  const clear = () => {
    SessionManager.clearBrowsingHistory();
    setHistory([]);
  };

  const openUrl = async (url: string) => {
    onClose();
    await Navigator.go(url);
  };

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
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">History</h2>
            </div>
            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button onClick={clear} className="p-2 rounded-lg hover:bg-muted" aria-label="Clear history">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Clock className="w-10 h-10 opacity-40" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => openUrl(item.url)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {item.url.replace(/^https?:\/\//, '')}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatTime(item.visitedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
