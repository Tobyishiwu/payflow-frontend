import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getAdminUsers } from "../../services/adminUserService";
import AdminFundModal from "../../components/admin/AdminFundModal";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Account {
  id: number;
  account_number: string;
  balance: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  accounts?: Account[];
}

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data =
        await getAdminUsers();

      setUsers(data);
    } catch (error) {
      console.error(
        "Failed to load users",
        error
      );

      toast.error(
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (
    amount: string,
    description: string
  ) => {
    if (!selectedUser) return;

    const account =
      selectedUser.accounts?.[0];

    if (!account) {
      toast.error(
        "Account not found"
      );
      return;
    }

    try {
      await api.post(
        "/admin/fund-account",
        {
          account_id: account.id,
          amount: Number(amount),
          description,
        }
      );

      toast.success(
        "Account funded successfully"
      );

      setSelectedUser(null);

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(
        "Funding failed"
      );
    }
  };

  const filteredUsers =
    users.filter((user) => {
      const account =
        user.accounts?.[0];

      const term =
        search.toLowerCase();

      return (
        user.name
          .toLowerCase()
          .includes(term) ||
        user.email
          .toLowerCase()
          .includes(term) ||
        (
          account?.account_number ||
          ""
        )
          .toLowerCase()
          .includes(term)
      );
    });

    const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Users Management
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage all
          PayFlow users.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search by name, email or account number..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length ===
          0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-50 border-b">

                <tr>
                  <th className="text-left p-5">
                    User
                  </th>

                  <th className="text-left p-5">
                    Account Number
                  </th>

                  <th className="text-left p-5">
                    Balance
                  </th>

                  <th className="text-left p-5">
                    Joined
                  </th>

                  <th className="text-left p-5">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => {
                    const account =
                      user.accounts?.[0];

                    return (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-slate-50 transition"
                      >
                        <td className="p-5">
                          <div>
                            <p className="font-semibold">
                              {user.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </td>

                        <td className="p-5 font-mono">
                          {account?.account_number ||
                            "N/A"}
                        </td>

                        <td className="p-5 font-semibold text-green-600">
                          ₦
                          {Number(
                            account?.balance ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td className="p-5 text-gray-500">
                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-5">
                          <div className="flex gap-2">

                            <button
  onClick={() =>
    navigate(
      `/admin/users/${user.id}`
    )
  }
  className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
>
  View
</button>

                            <button
                              onClick={() =>
                                setSelectedUser(
                                  user
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                            >
                              Fund
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <AdminFundModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onSubmit={handleFund}
        />
      )}
    </AdminLayout>
  );
}

export default AdminUsersPage;