'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ItemCard from '../components/ItemCard';
import CategoryIconBadge from '../components/CategoryIcon';
import Loader from '../components/Loader';
import { fetchItems, Item } from '../lib/api';

const FEATURED_COUNT = 6;

const categories = [
  { label: 'Electronics', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-300' },
  { label: 'Furniture', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-300' },
  { label: 'Accessories', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-300' },
  { label: 'Sportswear', color: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-300' },
  { label: 'Kitchen', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-300' },
  { label: 'Home', color: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 text-teal-300' },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    router.push(q ? `/items?search=${encodeURIComponent(q)}` : '/items');
  };

  useEffect(() => {
    fetchItems()
      .then((res) => {
        setTotal(res.total);
        setFeatured(res.data.slice(0, FEATURED_COUNT));
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative px-4 pt-20 pb-24 sm:px-8 text-center overflow-hidden">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-[80px]" />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-indigo-300 font-medium mb-8 tracking-widest uppercase animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Vibe Dashboard · v1.0
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6 animate-fade-in"
          style={{ animationDelay: '60ms' }}
        >
          Discover Your{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next Vibe
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-indigo-400/0 via-purple-400/60 to-pink-400/0 rounded-full" />
          </span>
        </h1>

        {/* Sub-text */}
        <p
          className="text-white/45 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in"
          style={{ animationDelay: '120ms' }}
        >
          A curated collection of premium products — from cutting-edge electronics
          to everyday essentials. Find what resonates.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 animate-fade-in"
          style={{ animationDelay: '180ms' }}
        >
          <Link
            href="/items"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-500/90 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
          >
            Browse All Products
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <form
            onSubmit={handleHeroSearch}
            className="relative flex items-center glass-strong rounded-2xl overflow-hidden"
          >
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="w-56 sm:w-72 pl-5 pr-12 py-3.5 bg-transparent text-sm font-medium text-white placeholder-white/35 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>

        {/* Stats row */}
        {!loading && !error && (
          <div
            className="inline-flex items-center divide-x divide-white/10 glass rounded-2xl px-2 animate-fade-in"
            style={{ animationDelay: '240ms' }}
          >
            {[
              { value: total, label: 'Products' },
              { value: categories.length, label: 'Categories' },
              { value: '100%', label: 'Curated' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-3 text-center">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          CATEGORY QUICK-LINKS
      ══════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 mb-20 max-w-6xl mx-auto">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map(({ label, color }) => (
            <Link
              key={label}
              href={`/items?category=${label}`}
              className={`
                group flex flex-col items-center gap-2 p-4 rounded-2xl
                bg-gradient-to-br border backdrop-blur-md ${color}
                hover:scale-105 hover:shadow-lg transition-all duration-200
              `}
            >
              <CategoryIconBadge category={label} className="w-6 h-6" />
              <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED PRODUCTS (6 items)
      ══════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 mb-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Products</h2>
            <p className="text-white/35 text-xs mt-1">Hand-picked highlights from our collection</p>
          </div>
          <Link
            href="/items"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            View all {total > 0 ? total : ''} products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm text-white/50">Couldn&apos;t load products</p>
            <p className="text-xs text-white/25">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((item, i) => (
              <li key={item.id}>
                <ItemCard item={item} index={i} />
              </li>
            ))}
          </ul>
        )}

        {/* Mobile "view all" */}
        {!loading && !error && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass text-sm font-medium text-white/60 hover:text-white transition-all"
            >
              View all {total} products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 mb-20 max-w-6xl mx-auto">
        <div className="relative rounded-3xl glass-strong overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Ready to explore everything?
          </h2>
          <p className="text-white/40 text-sm mb-7 max-w-sm mx-auto">
            Browse all {total > 0 ? total : ''} products, filter by category, and find exactly what you need.
          </p>
          <Link
            href="/items"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-500/90 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            Go to Full Catalogue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 pb-10 pt-4 border-t border-white/8 text-center">
        <p className="text-xs text-white/20">
          The Vibe Dashboard · Built with Next.js 14 + Express · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
