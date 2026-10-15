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

  const letter = engine.name[0].toUpperCase();

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 pl-1.5 pr-1 py-1 rounded-full hover:bg-muted/80"
      >
        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
          {letter}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-label="Close"
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute left-0 top-full mt-1 z-50 w-44 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
            >
              {SEARCH_ENGINES.map((e) => (
                <button
                  key={e.id}
                  type="button"
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
