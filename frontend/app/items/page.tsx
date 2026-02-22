'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import ItemCard from '../../components/ItemCard';
import Loader from '../../components/Loader';
import { fetchItems, Item } from '../../lib/api';

function ItemsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? searchParams.get('category') ?? '';

  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchItems(search);
      setItems(res.data);
      setTotal(res.total);
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(initialSearch); }, [load, initialSearch]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      load(value);
      const url = value.trim() ? `/items?search=${encodeURIComponent(value.trim())}` : '/items';
      router.replace(url, { scroll: false });
    },
    [load, router]
  );

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      {/* ── Back link ── */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-indigo-300 font-medium mb-4 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          All Products
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Browse{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Everything
          </span>
        </h1>
        <p className="text-white/40 text-sm">
          {!loading && !error && `${total} product${total !== 1 ? 's' : ''} in the catalogue`}
        </p>
      </header>

      {/* ── Search ── */}
      <section className="max-w-6xl mx-auto mb-6">
        <SearchBar onSearch={handleSearch} initialValue={initialSearch} />
      </section>

      {/* ── Category pills ── */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto mb-8 flex flex-wrap gap-2">
          {['All', 'Electronics', 'Furniture', 'Accessories', 'Sportswear', 'Kitchen', 'Home'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleSearch(cat === 'All' ? '' : cat)}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200
                ${(cat === 'All' && query === '') || query === cat
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                  : 'glass text-white/40 hover:text-white/70 hover:bg-white/10'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Results label ── */}
      {!loading && !error && query.trim() && (
        <div className="max-w-6xl mx-auto mb-4 px-1">
          <p className="text-xs text-white/35">
            {total} result{total !== 1 ? 's' : ''} for &quot;{query.trim()}&quot;
          </p>
        </div>
      )}

      {/* ── Content ── */}
      <section className="max-w-6xl mx-auto">
        {loading && <Loader />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-red-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white/70">Failed to load products</p>
            <p className="text-xs text-white/35 max-w-xs">{error}</p>
            <button
              onClick={() => load(query)}
              className="mt-2 px-5 py-2 rounded-xl text-xs font-medium glass hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white/30">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white/60">No results found</p>
            <p className="text-xs text-white/30">Try a different search term.</p>
            <button
              onClick={() => handleSearch('')}
              className="mt-2 px-5 py-2 rounded-xl text-xs font-medium glass hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              Show all products
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item, i) => (
              <li key={item.id}>
                <ItemCard item={item} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto mt-16 pt-6 border-t border-white/8 text-center">
        <p className="text-xs text-white/20">
          The Vibe Dashboard · Built with Next.js 14 + Express · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-white/15 border-t-indigo-400 animate-spin" />
      </main>
    }>
      <ItemsContent />
    </Suspense>
  );
}