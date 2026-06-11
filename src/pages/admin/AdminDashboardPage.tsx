import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminStatCard from "../../components/admin/AdminStatCard";
import api from "../../services/api";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_accounts: 0,
    total_transactions: 0,
    total_balance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/admin/stats"
      );

      setStats(response.data);
    } catch (error) {
      console.error(
        "Failed to load admin stats",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor your PayFlow platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <AdminStatCard
          title="Total Users"
          value={
            loading
              ? "..."
              : stats.total_users.toString()
          }
        />

        <AdminStatCard
          title="Total Accounts"
          value={
            loading
              ? "..."
              : stats.total_accounts.toString()
          }
        />

        <AdminStatCard
          title="Total Transactions"
          value={
            loading
              ? "..."
              : stats.total_transactions.toString()
          }
        />

        <AdminStatCard
          title="Total Balance"
          value={
            loading
              ? "..."
              : `₦${Number(
                  stats.total_balance
                ).toLocaleString()}`
          }
        />

      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;