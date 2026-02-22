import { Item } from '../lib/api';

const categoryColor: Record<string, string> = {
  Electronics: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Furniture: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Accessories: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Sportswear: 'bg-green-500/20 text-green-300 border-green-500/30',
  Kitchen: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Home: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const fallbackColor = 'bg-white/10 text-white/60 border-white/20';

interface ItemCardProps {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: ItemCardProps) {
  const badgeClass = categoryColor[item.category] ?? fallbackColor;

  return (
    <article
      className="
        group relative glass rounded-2xl p-5
        hover:bg-white/10 hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/10
        transition-all duration-300 ease-out cursor-default
        animate-fade-in
      "
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Category badge */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass} mb-3`}
      >
        {item.category}
      </span>

      {/* Name */}
      <h2 className="text-base font-semibold text-white leading-snug mb-1.5 group-hover:text-indigo-200 transition-colors">
        {item.name}
      </h2>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">
        {item.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
        <span className="text-lg font-bold text-white">
          ₹{item.price.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] text-white/30 font-mono">#{String(item.id).padStart(3, '0')}</span>
      </div>
    </article>
  );
}
