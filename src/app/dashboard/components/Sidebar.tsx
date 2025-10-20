import { BarChart3, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 p-6 flex flex-col">
      <nav className="flex flex-col gap-2 mt-4">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-neutral-800 transition-colors font-medium"
        >
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </a>

        <a
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-neutral-800 transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          Settings
        </a>
      </nav>
    </aside>
  );
}


