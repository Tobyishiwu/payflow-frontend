import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: Receipt,
    },
    {
      name: "Fund Accounts",
      path: "/admin/funding",
      icon: Wallet,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-72 bg-[#0F172A] text-white h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        PayFlow
      </h1>

      <div className="space-y-2">

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition"
            >
              <Icon size={20} />

              {link.name}
            </NavLink>
          );
        })}

      </div>

      <button
        className="mt-10 flex items-center gap-3 text-red-400"
      >
        <LogOut size={20} />
        Logout
      </button>

    </div>
  );
}

export default AdminSidebar;