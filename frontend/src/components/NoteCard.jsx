import { useState } from "react";
import { useNavigate } from "react-router";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Delete note
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  // Navigate to note detail page
  const handleNavigate = () => {
    navigate(`/note/${note._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="rounded-2xl p-[2px] bg-gradient-to-r from-primary via-secondary to-accent shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="rounded-2xl bg-base-100 flex flex-col h-full">
        <div className="card-body flex flex-col flex-grow">
          {/* Title */}
          <h3 className="card-title text-lg font-bold text-base-content mb-2">
            {note.title}
          </h3>

          {/* Note content */}
          <p
            className="text-base-content whitespace-pre-wrap leading-relaxed transition-all duration-300"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "none" : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {note.content}
          </p>

          {/* Read more / less */}
          {note.content.length > 120 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // prevent navigating to note detail
                setExpanded((p) => !p);
              }}
              className="mt-1 text-sm font-semibold text-primary hover:underline w-fit"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}

          {/* Footer */}
          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm font-medium text-base-content">
              {formatDate(new Date(note.createdAt))}
            </span>

            <div className="flex items-center gap-2">
              {/* Edit icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // prevent navigating to note detail
                  navigate(`/note/edit/${note._id}`);
                }}
                className="text-base-content hover:text-primary"
              >
                <PenSquareIcon className="size-4" />
              </button>

              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
