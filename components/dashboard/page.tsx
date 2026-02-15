import React from "react";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ShoppingCart,
  Activity,
  MoreVertical,
} from "lucide-react";

// Mock data for charts and stats
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "bg-blue-500",
    period: "from last month",
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "bg-green-500",
    period: "from last week",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-3.2%",
    trend: "down",
    icon: ShoppingCart,
    color: "bg-purple-500",
    period: "from yesterday",
  },
  {
    title: "Conversion Rate",
    value: "3.45%",
    change: "+4.5%",
    trend: "up",
    icon: Activity,
    color: "bg-orange-500",
    period: "from last hour",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Alice Johnson",
    email: "alice@example.com",
    amount: "$234.50",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Bob Smith",
    email: "bob@example.com",
    amount: "$567.80",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "#ORD-003",
    customer: "Carol Davis",
    email: "carol@example.com",
    amount: "$123.45",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "#ORD-004",
    customer: "David Wilson",
    email: "david@example.com",
    amount: "$890.12",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "#ORD-005",
    customer: "Eva Brown",
    email: "eva@example.com",
    amount: "$345.67",
    status: "processing",
    date: "2024-01-13",
  },
];

const topProducts = [
  {
    name: "Premium Headphones",
    sales: 1234,
    revenue: "$45,678",
    growth: "+12%",
  },
  {
    name: "Wireless Mouse",
    sales: 987,
    revenue: "$23,456",
    growth: "+8%",
  },
  {
    name: "Mechanical Keyboard",
    sales: 756,
    revenue: "$56,789",
    growth: "+15%",
  },
  {
    name: "4K Monitor",
    sales: 543,
    revenue: "$67,890",
    growth: "-2%",
  },
];

const activityData = [
  {
    user: "John Doe",
    action: "created a new order",
    target: "#ORD-006",
    time: "2 minutes ago",
  },
  {
    user: "Jane Smith",
    action: "updated product inventory",
    target: "Premium Headphones",
    time: "15 minutes ago",
  },
  {
    user: "Mike Johnson",
    action: "processed refund for",
    target: "#ORD-003",
    time: "1 hour ago",
  },
  {
    user: "Sarah Williams",
    action: "added new product",
    target: "Wireless Earbuds",
    time: "3 hours ago",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`flex items-center text-sm ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <TrendingUp className="mr-1 h-4 w-4" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4" />
                        )}
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {stat.period}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg ${stat.color} p-3 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-gray-600"></div>
              </div>
            );
          })}
        </div>

        {/* Charts and Analytics */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h2>
              <div className="flex items-center gap-2">
                <button className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  Week
                </button>
                <button className="rounded-lg bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  Month
                </button>
                <button className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  Year
                </button>
              </div>
            </div>
            <div className="h-64 w-full rounded-lg bg-gray-50 dark:bg-gray-800">
              {/* Chart component would go here */}
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Chart visualization placeholder
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {activityData.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
              View All Activity
            </button>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                    >
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {order.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {order.amount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <span
                        className={`text-sm ${
                          product.growth.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.growth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{product.sales.toLocaleString()} sales</span>
                      <span className="font-medium">{product.revenue}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: `${(index + 1) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
