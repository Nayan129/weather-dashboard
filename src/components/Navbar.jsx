
export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-[#0f172a] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌤️</span>
        <h1 className="text-white font-semibold text-lg">Weather Dashboard</h1>
      </div>
      <div className="flex gap-2">
        {["current", "historical"].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePage === page
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {page === "current" ? "Current" : "Historical"}
          </button>
        ))}
      </div>
    </nav>
  );
}