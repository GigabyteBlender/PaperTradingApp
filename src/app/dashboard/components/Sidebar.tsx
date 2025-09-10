export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 p-6 flex flex-col">
      <nav className="flex flex-col gap-2 mt-4">
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-neutral-800 transition-colors font-medium"
        >
          <span role="img" aria-label="Portfolio">📊</span>
          Portfolio
        </a>
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-neutral-800 transition-colors font-medium"
        >
          <span role="img" aria-label="Settings">⚙️</span>
          Settings
        </a>
      </nav>
    </aside>
  );
}


