import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Navigator } from '@/browser';
import { SEARCH_ENGINES } from '@/data/searchEngines';
import { cn } from '@/lib/utils';

export function SearchEngineSwitcher() {
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState(Navigator.getSearchEngine());

  const select = (e: typeof engine) => {
    setEngine(e);
    Navigator.setSearchEngine(e);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted"
      >
        <span className="font-medium text-foreground">{engine.name}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-label="Close"
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
            >
              {SEARCH_ENGINES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => select(e)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-muted',
                    e.id === engine.id && 'bg-primary/10'
                  )}
                >
                  <span>{e.name}</span>
                  {e.id === engine.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
