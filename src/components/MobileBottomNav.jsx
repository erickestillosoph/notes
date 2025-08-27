import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Archive, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: "home", label: "Home", icon: Home, path: "/" },
    { key: "search", label: "Search", icon: Search, path: "/search" },
    { key: "archived", label: "Archived", icon: Archive, path: "/archived" },
    { key: "tags", label: "Tags", icon: Tag, path: "/tags" },
    { key: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            size="sm"
            className={cn(
              "flex-col gap-1 h-12 text-xs",
              isActive(item.path) ? "text-blue-600 bg-blue-50" : "text-gray-600"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
