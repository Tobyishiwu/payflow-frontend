import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminUser,
  toggleAccountStatus,
} from "../../services/adminUserService";
import toast from "react-hot-toast";

interface Account {
  id: number;
  account_number: string;
  balance: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  accounts?: Account[];
}

function AdminUserDetailsPage() {
  const { id } = useParams();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data =
        await getAdminUser(id!);

      setUser(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus =
    async () => {
      if (!user?.accounts?.[0])
        return;

      try {
        setUpdating(true);

        const response =
          await toggleAccountStatus(
            user.accounts[0].id
          );

        toast.success(
          response.status ===
            "active"
            ? "Account Activated"
            : "Account Restricted"
        );

        await fetchUser();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to update account"
        );
      } finally {
        setUpdating(false);
      }
    };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-xl font-semibold">
              Loading User...
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              User Not Found
            </h2>

            <p className="text-gray-500 mt-2">
              The requested user could
              not be loaded.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const account =
    user.accounts?.[0];

  const isActive =
    account?.status === "active";

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            User Details
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer account
            access and review account
            information.
          </p>
        </div>

        {/* Main Card */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          {/* Top Section */}

          <div className="p-8 border-b">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <h2 className="text-3xl font-bold text-slate-900">
                  {user.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {user.email}
                </p>

              </div>

              <div
                className={`px-5 py-3 rounded-full text-sm font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {isActive
                  ? "🟢 Active"
                  : "🟡 Restricted"}
              </div>

            </div>

          </div>

          {/* Account Info */}

          <div className="p-8">

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-slate-50 rounded-2xl p-6">

                <p className="text-gray-500 text-sm">
                  Account Number
                </p>

                <p className="text-xl font-bold mt-2">
                  {account?.account_number ||
                    "N/A"}
                </p>

              </div>

              <div className="bg-slate-50 rounded-2xl p-6">

                <p className="text-gray-500 text-sm">
                  Balance
                </p>

                <p className="text-xl font-bold text-green-600 mt-2">
                  ₦
                  {Number(
                    account?.balance ||
                      0
                  ).toLocaleString()}
                </p>

              </div>

              <div className="bg-slate-50 rounded-2xl p-6">

                <p className="text-gray-500 text-sm">
                  Joined
                </p>

                <p className="text-xl font-bold mt-2">
                  {new Date(
                    user.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

            {/* Restriction Warning */}

            {!isActive && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">

                <h3 className="font-semibold text-yellow-800">
                  Account Restricted
                </h3>

                <p className="text-yellow-700 mt-2 text-sm">
                  This account is
                  currently restricted.
                  Transfers and other
                  sensitive actions
                  should be blocked until
                  access is restored.
                </p>

              </div>
            )}

            {/* Status Toggle */}

            <div className="mt-10 border-t pt-8">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-semibold">
                    Account Status
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Restrict this account
                    if suspicious activity
                    is detected. The user
                    will be notified and
                    prevented from making
                    transfers.
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  {updating && (
                    <span className="text-sm text-gray-500">
                      Updating...
                    </span>
                  )}

                  <button
                    onClick={
                      handleToggleStatus
                    }
                    disabled={updating}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${
                      isActive
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        isActive
                          ? "translate-x-9"
                          : "translate-x-1"
                      }`}
                    />
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminUserDetailsPage;