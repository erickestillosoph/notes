import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function NotesList({
  notes,
  selectedNoteId,
  onNoteSelect,
  loading,
}) {
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No notes found</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const truncateContent = (content, maxLength = 80) => {
    if (!content) return "";
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    return plainText.length > maxLength
      ? plainText.slice(0, maxLength) + "..."
      : plainText;
  };

  return (
    <div className="grid grid-cols-3 w-full">
      {notes.map((note) => (
        <button
          key={note._id}
          onClick={() => onNoteSelect(note._id)}
          className={cn(
            "w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ",
            selectedNoteId === note._id && "bg-blue-50 border-blue-200"
          )}
        >
          <div
            className="space-y-2 grid text-center justify-center"
            style={{ alignContent: "center" }}
          >
            <h3 className="font-medium text-base text-gray-900 line-clamp-1">
              {note.title || "Untitled"}
            </h3>
            <div
              className="space-y-2"
              style={{ alignContent: "center", margin: "auto" }}
            >
              <img
                src={note.image}
                alt="alt"
                width="100px"
                height="100px"
                style={{ borderRadius: "100%", backgroundColor: "black" }}
              />
            </div>

            {note.content && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {truncateContent(note.content)}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {note.tags?.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-primary/25 text-primary hover:bg-primary/50"
                  >
                    {tag}
                  </Badge>
                ))}

                {note.tags?.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 border-primary text-primary"
                  >
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              <span className="text-xs text-gray-500">
                {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
