import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotesList from "./NotesList";
import { api } from "../../convex/_generated/api";

export default function SearchView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const searchResults = useQuery(
    api.notes.searchNotes,
    user && searchTerm.trim()
      ? { userId: user.id, searchTerm: searchTerm.trim() }
      : "skip"
  );

  const selectedNote = searchResults?.find(
    (note) => note._id === selectedNoteId
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Auto-select first note if none selected and notes available
    if (searchResults?.length && !selectedNoteId && !isMobile) {
      setSelectedNoteId(searchResults[0]._id);
    }
  }, [searchResults, selectedNoteId, isMobile]);

  const handleNoteSelect = (noteId) => {
    if (isMobile) {
      navigate(`/note/${noteId}`);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Search Panel */}
      <div className="w-full md:w-full flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Search className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Search Notes
            </h1>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {searchTerm.trim() && (
            <p className="text-sm text-gray-500 mt-2">
              {searchResults?.length || 0} results for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto bg-white">
          {searchTerm.trim() ? (
            <NotesList
              notes={searchResults || []}
              selectedNoteId={selectedNoteId}
              onNoteSelect={handleNoteSelect}
              loading={searchTerm.trim() && !searchResults}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Search your notes</p>
              <p className="text-sm">
                Enter a search term to find your notes by title, content, or
                tags
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Note Preview Panel - Desktop Only */}
      {!isMobile && (
        <div className="flex-1 min-w-80 bg-white">
          {selectedNote && (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>
                  {searchTerm.trim()
                    ? "Select a search result to view it here"
                    : "Enter a search term to see results"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
