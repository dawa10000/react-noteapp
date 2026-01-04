import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="
              inline-flex items-center gap-2
              text-base-content/70
              hover:text-primary
              transition mb-6
            "
          >
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          {/* Card */}
          <div
            className="
              relative rounded-2xl
              bg-base-100/80 backdrop-blur
              border border-base-300
              border-t-4 border-t-primary
              shadow-xl
            "
          >
            {/* glow */}
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl opacity-30 -z-10" />

            <div className="card-body">
              <h2 className="text-3xl font-bold mb-6 text-base-content">
                Create New Note
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="form-control">
                  <label className="label p-5 pb-3">
                    <span className="label-text text-sm font-semibold text-base-content/80">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Amazing idea..."
                    className="
      input input-bordered
      h-12
      px-4
      focus:outline-none
      focus:border-primary
      focus:ring-2 focus:ring-primary/30
    "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div className="form-control mt-2">
                  <label className="label p-5 pb-3">
                    <span className="label-text text-sm font-semibold text-base-content/80">
                      Content
                    </span>
                  </label>
                  <textarea
                    placeholder="Write your thoughts here..."
                    className="
      textarea textarea-bordered
      h-44
      px-4 py-3
      leading-relaxed
      focus:outline-none
      focus:border-primary
      focus:ring-2 focus:ring-primary/30
    "
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary  px-10 shadow-lg hover:shadow-primary/40 transition-all"
                  >
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
