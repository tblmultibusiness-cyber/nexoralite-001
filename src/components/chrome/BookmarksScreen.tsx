import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Plus, Trash2 } from 'lucide-react';
import { Navigator } from '@/browser';

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
}

interface BookmarksScreenProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'nexora-001-bookmarks';

function loadBookmarks(): BookmarkItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveBookmarks(items: BookmarkItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function BookmarksScreen({ open, onClose }: BookmarksScreenProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(loadBookmarks);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const persist = (items: BookmarkItem[]) => {
    setBookmarks(items);
    saveBookmarks(items);
  };

  const add = () => {
    const t = title.trim();
    let u = url.trim();
    if (!t || !u) return;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    const next = [{ id: Date.now().toString(), title: t, url: u }, ...bookmarks];
    persist(next);
    setTitle('');
    setUrl('');
    setAdding(false);
  };

  const remove = (id: string) => {
    persist(bookmarks.filter((b) => b.id !== id));
  };

  const openUrl = async (u: string) => {
    onClose();
    await Navigator.go(u);
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
              <Bookmark className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Bookmarks</h2>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setAdding(true)} className="p-2 rounded-lg hover:bg-muted" aria-label="Add bookmark">
                <Plus className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {adding && (
            <div className="p-4 border-b border-border space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm outline-none focus:border-primary"
              />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                inputMode="url"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancel</button>
                <button onClick={add} className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground">Save</button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Bookmark className="w-10 h-10 opacity-40" />
                <p className="text-sm">No bookmarks yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {bookmarks.map((b) => (
                  <li key={b.id} className="flex items-center gap-2 px-4 py-3">
                    <button onClick={() => openUrl(b.url)} className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{b.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{b.url.replace(/^https?:\/\//, '')}</p>
                    </button>
                    <button onClick={() => remove(b.id)} className="p-2 rounded-lg hover:bg-muted" aria-label="Remove">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
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
