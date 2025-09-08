import { useState } from "react";
import { useMutation } from "convex/react";
import { Archive, Trash2, Share, MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import ShareDialog from "./ShareDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function NotePreview({ note, onEdit }) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const toggleArchive = useMutation(api.notes.toggleArchiveNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const handleArchive = async () => {
    try {
      await toggleArchive({ id: note._id });
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } catch {
      toast.error("Failed to archive note");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote({ id: note._id });
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2 border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
            >
              <Pencil />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Share className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleArchive} className="mb-1">
                  <Archive className="size-4 mr-2" />
                  {note.isArchived ? "Unarchive" : "Archive"} Note
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild className="w-full">
                    <Button variant="destructive">
                      <Trash2 className="size-4 mr-2" />
                      Delete Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Note</DialogTitle>
                      <DialogDescription>
                        Deleting a note is a permanent action. Proceed with
                        caution.
                      </DialogDescription>

                      <DialogFooter>
                        <DialogClose className="text-sm mr-4">
                          Cancel
                        </DialogClose>

                        <Button onClick={handleDelete} variant="destructive">
                          Delete note
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="p-6 prose prose-gray max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: note.content || '<p class="text-gray-500">No content</p>',
          }}
        />
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        note={note}
      />
    </div>
  );
}
