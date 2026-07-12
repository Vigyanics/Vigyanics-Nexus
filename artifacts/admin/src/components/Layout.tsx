import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Products", path: "/products", icon: <Package className="w-4 h-4" /> },
  { label: "Categories", path: "/categories", icon: <Tag className="w-4 h-4" /> },
  { label: "Orders", path: "/orders", icon: <ShoppingCart className="w-4 h-4" /> },
  { label: "Customers", path: "/customers", icon: <Users className="w-4 h-4" /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
            <span className="text-primary font-bold text-xs font-display">V</span>
          </div>
          <div>
            <div className="text-foreground font-semibold text-sm font-display leading-tight">Vigyanics</div>
            <div className="text-muted-foreground text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-widest">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/" ? location === "/" : location.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              className={`sidebar-link w-full ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <div className="text-sm font-medium text-foreground">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          <div className="mt-1">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary capitalize">
              {user?.role?.replace("_", " ")}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden btn-ghost p-1.5"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground font-display">
              {NAV_ITEMS.find((n) => (n.path === "/" ? location === "/" : location.startsWith(n.path)))?.label ?? "Admin"}
            </h2>
          </div>

          <button className="btn-ghost p-1.5 relative">
            <Bell className="w-4 h-4" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
