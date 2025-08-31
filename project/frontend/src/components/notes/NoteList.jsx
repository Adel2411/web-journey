import { useState, useEffect } from "react";
import { X } from "lucide-react";
import NoteItem from "./NoteItem";
import { getAllNotes, createNote } from "../../services/api";
import { NoteForm } from "./NoteForm";


const token = localStorage.getItem("token");


const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createForm, setCreateForm] =useState(false)
  const [isCreating, setIsCreating] = useState(false);


  const handleCreateSubmit = async (formData) => {
      setIsCreating(true);
  
      try {
        const token = localStorage.getItem("token");
        await createNote(formData, token);

        setCreateForm(false);

      } catch (error) {
        console.error("Failed to create the  note:", error);
        alert("Failed to create note. Please try again.");
      } finally {
        setIsCreating(false);
      }
    };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllNotes(token);
        setNotes(data.notes || []); 

      } catch (err) {
        setError(err.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  // state for selecting to see user notes
  const [showUserNotes, setShowUserNotes] = useState(false);
  // state for selecting a note to read more
  const [selectedNote, setSelectedNote] = useState(null);
  // state for note like
  const [likedNotes, setLikedNotes] = useState({});

  const filteredNotes = showUserNotes
    ? notes.filter((note) => note.authorName === user)
    : notes;

  const toggleFilter = () => setShowUserNotes((p) => !p);
  const unselectNote = () => setSelectedNote(null);
  const likeClick = (noteId) =>
    setLikedNotes((prev) => ({ ...prev, [noteId]: !prev[noteId] }));

  return (
    <>
      {/* Create Form */}
      {createForm && (
        <NoteForm 
            mode = "create"
            initialData={{
            title : "",
            content : "",
            isPublic : true
          }}
          onSubmit={handleCreateSubmit}
          onCancel={() => setCreateForm(false)}
          loading={isCreating}
        />
      )}
      <div className="relative max-w-6xl w-full mx-auto py-4 sm:py-6">
        {/* selected note view */}
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg">
              {/* return button */}
              <button
                onClick={unselectNote}
                className="absolute -top-3 -right-3 bg-gray-800 text-gray-200 hover:text-white rounded-full p-1 shadow"
              >
                <X size={20} />
              </button>
              {/* note */}
              <div className="bg-[#20202f] text-white rounded-2xl shadow-2xl p-6 flex flex-col max-h-[80vh] overflow-y-auto">
                <NoteItem
                  note={selectedNote}
                  full
                  isLiked={!!likedNotes[selectedNote.id]}
                  onToggleLike={() => likeClick(selectedNote.id)}
                />
              </div>
            </div>
          </div>
        )}

        {/* grid header */}
        <div className="bg-[#20202f] px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow flex flex-wrap justify-between items-center gap-3 sm:gap-4 text-white mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">
            {showUserNotes ? "My Notes" : "All Notes"}
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-sm font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              onClick={() => setCreateForm(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
            <button
              onClick={toggleFilter}
              className="bg-[#2d2d42] hover:bg-[#3b3b58] px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg transition"
            >
              Show {showUserNotes ? "All Notes" : "My Notes"}
            </button>

            {/* total counter */}
            <span className="bg-[#2f2f46] text-white text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
              {filteredNotes.length} Note{filteredNotes.length !== 1 && "s"}
            </span>
            
          </div>

        </div>

        {/* notes grid */}
        {loading ? (
            <p className="text-center text-gray-400">Loading notes...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-center text-gray-400">
              {showUserNotes ? "You have no notes yet." : "No notes in the system."}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isLiked={!!likedNotes[note.id]}
                  onToggleLike={() => likeClick(note.id)}
                  onShowFull={() => setSelectedNote(note)}
                />
              ))}
            </div>
          )}

      </div>
    </>
  );
};


export default NoteList;

