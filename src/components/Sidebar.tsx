'use client';

import { BarChart3, Settings, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 
          p-6 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>

        <div className="mb-8">
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
    </>
  );
}


