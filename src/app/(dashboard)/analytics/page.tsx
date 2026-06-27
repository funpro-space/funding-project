export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Early Usage Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-3xl font-bold">142</p>
          <p className="text-sm text-green-500 mt-2">↑ 12% from last week</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Smart Wallets</h3>
          <p className="text-3xl font-bold">89</p>
          <p className="text-sm text-green-500 mt-2">↑ 5% from last week</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Budgets Logged</h3>
          <p className="text-3xl font-bold">34</p>
          <p className="text-sm text-blue-500 mt-2">Deployed on Base Mainnet</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Onchain Activity</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm">Budget hash QmXyZ... logged</span>
            <span className="text-xs text-gray-500">2 mins ago</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm">Budget hash QmAbc... logged</span>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </li>
          <li className="flex justify-between items-center py-2">
            <span className="text-sm">Smart Wallet connected</span>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
