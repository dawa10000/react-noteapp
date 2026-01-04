import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import api from "../lib/axios";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
      setIsRateLimited(false);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 429) setIsRateLimited(true);
      else toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}
        {!loading && isRateLimited && <RateLimitedUI />}
        {!loading && !isRateLimited && notes.length === 0 && <NotesNotFound />}

        {!loading && !isRateLimited && notes.length > 0 && (
          <div className="flex flex-wrap -mx-3 gap-y-6">
            {notes.map((note) => (
              <div key={note._id} className="w-full sm:w-1/2 lg:w-1/3 px-3">
                <NoteCard note={note} setNotes={setNotes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
