import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import AdminRequests from "@/pages/AdminRequests";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const SUPER_ADMIN_ROLES = ["super_admin"];
const ANY_ADMIN_ROLES = ["admin", "super_admin"];

function roleHome(role?: string) {
  return role === "super_admin" ? "/" : "/products";
}

function ProtectedRoute({
  component: Component,
  roles,
}: {
  component: React.ComponentType;
  roles?: string[];
}) {
  const { token, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      navigate("/login");
      return;
    }
    if (roles && user && !roles.includes(user.role)) {
      // A normal admin must not be able to open super-admin-only routes.
      navigate(roleHome(user.role));
    }
  }, [isLoading, navigate, token, roles, user]);

  if (isLoading || !token) return null;
  if (roles && user && !roles.includes(user.role)) return null;

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} roles={SUPER_ADMIN_ROLES} />} />
      <Route path="/products" component={() => <ProtectedRoute component={Products} roles={ANY_ADMIN_ROLES} />} />
      <Route path="/categories" component={() => <ProtectedRoute component={Categories} roles={ANY_ADMIN_ROLES} />} />
      <Route path="/orders" component={() => <ProtectedRoute component={Orders} roles={SUPER_ADMIN_ROLES} />} />
      <Route path="/customers" component={() => <ProtectedRoute component={Customers} roles={SUPER_ADMIN_ROLES} />} />
      <Route path="/admin-requests" component={() => <ProtectedRoute component={AdminRequests} roles={SUPER_ADMIN_ROLES} />} />
      <Route>
        {() => {
          const { token, user, isLoading } = useAuth();
          const [, navigate] = useLocation();
          // IMPORTANT: Wait for auth restore before routing, otherwise a
          // super_admin could be briefly redirected to /products before their
          // role is loaded from localStorage/AuthContext.
          if (isLoading) return null;
          navigate(token ? roleHome(user?.role) : "/login");
          return null;
        }}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
