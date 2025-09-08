import { useNavigate, useLocation } from "react-router-dom";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { NotebookIcon, Archive, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import { Search } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const tags = useQuery(
    api.notes.getUserTags,
    user ? { userId: user.id } : "skip"
  );

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;

    return false;
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <NotebookIcon className="size-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">Notes</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto pb-20">
        <div className="space-y-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/")
                ? "bg-primary text-white hover:bg-primary-75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/")}
            title="All Notes (Ctrl + 1)"
          >
            <NotebookIcon /> All Notes
            <span className="ml-auto text-xs opacity-75">Ctrl+1</span>
          </Button>

          <Button
            variant={isActive("/archived") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/archived")
                ? "primary text-white hover:bg-primary/75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/archived")}
            title="Archived Notes (Ctrl+2)"
          >
            <Archive /> Archived Notes
            <span className="ml-auto text-xs opacity-75">Ctrl+2</span>
          </Button>

          <Button
            variant={isActive("/search") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/search")
                ? "primary text-white hover:bg-primary/75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/search")}
            title="Search Notes (Ctrl+3)"
          >
            <Search /> Search Notes
            <span className="ml-auto text-xs opacity-75">Ctrl+3</span>
          </Button>

          <Button
            variant={isActive("/settings") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/settings")
                ? "primary text-white hover:bg-primary/75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/settings")}
            title="settings Notes (Ctrl+4)"
          >
            <Settings /> Settings
            <span className="ml-auto text-xs opacity-75">Ctrl+4</span>
          </Button>
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 px-3 mb-3 uppercase tracking-wide">
              Tags
            </h3>

            <div className="space-y-1">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-1 text-xs h-9",
                    location.pathname === `/tags/${tag}`
                      ? "bg-primary/50 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                  onClick={() => navigate(`/tags/${tag}`)}
                >
                  <Tag className="size-3" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="absolute bottom-0 z-10 w-full border-t border-gray-800 py-2 px-4 bg-gray-900">
        <SignOutButton>
          <Button className="cursor-pointer bg-primary" size="sm">
            <LogOut /> Log out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
