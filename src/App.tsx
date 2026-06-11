import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import DashboardPage from "./pages/dashboard/DashboardPage";
import TransferPage from "./pages/dashboard/TransferPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import BeneficiariesPage from "./pages/dashboard/BeneficiariesPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SupportPage from "./pages/dashboard/SupportPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetailsPage";
import ServicesPage from "./pages/dashboard/ServicesPage";


import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
<Toaster
  position="top-center"
  containerStyle={{
    top: 500,
    right: 20,
  }}
/>

      <BrowserRouter>
        <Routes>

          {/* Public Routes */}

          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          {/* Protected Routes */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
<Route
  path="/services"
  element={
    <ProtectedRoute>
      <ServicesPage />
    </ProtectedRoute>
  }
/>
          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <TransferPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/beneficiaries"
            element={
              <ProtectedRoute>
                <BeneficiariesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
  path="/admin/users/:id"
  element={<AdminUserDetailsPage />}
/>
          
          <Route
  path="/admin/dashboard"
  element={<AdminDashboardPage />}
/>

<Route
  path="/admin/users"
  element={<AdminUsersPage />}
/>
          <Route
  path="/admin/login"
  element={<AdminLoginPage />}
/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;