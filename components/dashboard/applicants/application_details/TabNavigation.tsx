

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="w-full flex justify-center ">
      <div className="w-full max-w-7xl">
        <div className="bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-sm  mb-8 border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <nav className="flex flex-wrap items-center justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 
                      rounded-sm text-sm font-medium transition-all duration-300
                      hover:transform hover:-translate-y-0.5
                      ${
                        isActive
                          ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 ring-1 ring-indigo-500"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  >
                    {/* Icon container with linear background for active */}
                    <span
                      className={`
                      p-1.5 rounded-sm transition-all duration-300
                      ${
                        isActive
                          ? "bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                      }
                    `}
                    >
                      <Icon className="w-4 h-4" />
                    </span>

                    {/* Label with proper spacing */}
                    <span className="hidden xs:inline-block text-xs sm:text-sm font-medium">
                      {tab.label}
                    </span>

                    {/* Optional tooltip for mobile (shows full label) */}
                    <span
                      className="xs:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 
                      px-2 py-1 bg-gray-900 text-white text-xs rounded-sm opacity-0 
                      group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                      pointer-events-none z-50 shadow-lg"
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
