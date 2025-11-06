import { BarChart3, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Navigation
        </h2>
        <nav className="flex flex-col gap-1">
          <a
            href="/dashboard"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all duration-200 font-medium"
          >
            <div className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <BarChart3 className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            Dashboard
          </a>
          <a
            href="/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all duration-200 font-medium"
          >
            <div className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-600 transition-colors">
              <Settings className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </div>
            Settings
          </a>
        </nav>
      </div>
    </aside>
  );
}


