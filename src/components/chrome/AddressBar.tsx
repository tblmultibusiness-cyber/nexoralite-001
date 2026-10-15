import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Navigator } from '@/browser';
import { SearchEngineSwitcher } from './SearchEngineSwitcher';
import { cn } from '@/lib/utils';

interface AddressBarProps {
  currentUrl: string;
}

export function AddressBar({ currentUrl }: AddressBarProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);

  const display = focused ? value : currentUrl ? hostname(currentUrl) : '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = value.trim();
    if (!input || submitting.current) return;
    submitting.current = true;
    await Navigator.go(input);
    setValue('');
    setFocused(false);
    inputRef.current?.blur();
    setTimeout(() => {
      submitting.current = false;
    }, 300);
  };

  return (
    <div className="px-3 pt-2 pb-2">
      <form onSubmit={submit}>
        <div
          className={cn(
            'flex items-center gap-1.5 h-11 rounded-full px-2 border transition-colors',
            focused
              ? 'bg-muted/80 border-primary/50 nexora-glow'
              : 'bg-muted/40 border-border'
          )}
        >
          <SearchEngineSwitcher />
          <input
            ref={inputRef}
            value={focused ? value : display}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setValue(currentUrl || '');
            }}
            onBlur={() => setFocused(false)}
            placeholder="Search or type URL"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
          />
          {value && focused && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="p-1 rounded-full hover:bg-muted shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 rounded-full bg-primary text-primary-foreground shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
