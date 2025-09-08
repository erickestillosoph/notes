import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Tag, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotesList from "./NotesList";
// import NotePreview from "./NotePreview";
import { api } from "../../convex/_generated/api";

export default function TagsView() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const notes = useQuery(
    api.notes.getNotes,
    user && tag
      ? { userId: user.id, isArchived: false, tagFilter: tag }
      : "skip"
  );

  const filteredNotes = notes?.filter((note) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (filteredNotes?.length && !selectedNoteId && !isMobile) {
      setSelectedNoteId(filteredNotes[0]._id);
    }
  }, [filteredNotes, selectedNoteId, isMobile]);

  const handleNoteSelect = (noteId) => {
    if (isMobile) {
      navigate(`/note/${noteId}`);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  return (
    <div className="flex h-screen bg-white w-full">
      <div className="w-full md:w-full flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Tag className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-semibold text-gray-900">{tag}</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={`Search within ${tag} notes...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {filteredNotes && (
            <p className="text-sm text-gray-500 mt-2">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"} found
            </p>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto bg-white">
          <NotesList
            notes={filteredNotes || []}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            loading={!filteredNotes}
          />
        </div>
      </div>
    </div>
  );
}
