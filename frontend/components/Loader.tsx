export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-white/50">
      <span
        className="w-10 h-10 rounded-full border-[3px] border-white/15 border-t-indigo-400 animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm tracking-wide">Fetching items…</p>
    </div>
  );
}
