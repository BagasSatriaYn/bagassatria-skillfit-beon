import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Residents", path: "/residents", icon: "👥" },
    { name: "Houses", path: "/houses", icon: "🏠" },
    { name: "Payments", path: "/payments", icon: "💳" },
    { name: "Reports", path: "/reports", icon: "📑" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl">
      {/* Brand / Logo Area */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">SMART <span className="text-white">RT</span></h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        <p>Apprentice Test &copy; 2026</p>
      </div>
    </aside>
  );
}