export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="text-lg font-semibold text-slate-700 tracking-wide">
        Housing Administration System
      </div>
      
      {/* User Profile Area */}
      <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-slate-800">Ketua RT</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
        <div className="h-10 w-10 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold shadow-inner">
          RT
        </div>
      </div>
    </header>
  );
}