import { useState, useRef } from 'react';
import { Search, X, Shield } from 'lucide-react';
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

  const display = focused ? value : (currentUrl ? hostname(currentUrl) : '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = value.trim();
    if (!input || submitting.current) return;
    submitting.current = true;
    await Navigator.go(input);
    setValue('');
    setFocused(false);
    inputRef.current?.blur();
    setTimeout(() => { submitting.current = false; }, 300);
  };

  return (
    <div className="px-3 pt-2 pb-1 space-y-1">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Search with
        </span>
        <SearchEngineSwitcher />
      </div>

      <form onSubmit={submit}>
        <div
          className={cn(
            'flex items-center gap-2 h-11 rounded-full px-3 border transition-colors',
            focused
              ? 'bg-muted/80 border-primary/60 nexora-glow'
              : 'bg-muted/50 border-border'
          )}
        >
          <Shield className="w-4 h-4 text-primary shrink-0" />
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
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {value && focused && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button type="submit" className="p-1.5 rounded-full bg-primary/20 text-primary">
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
