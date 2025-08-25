import { useState } from "react";
import { X } from "lucide-react";
import { sampleNotes } from "../../data/sampleNotes";
import NoteItem from "./NoteItem";

const user = "John Doe";

const NoteList = () => {
  const [notes, setNotes] = useState(sampleNotes);
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
      {notes.length === 0 ? (
        <p className="text-center text-gray-400">No notes in the system.</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-center text-gray-400">You have no notes yet.</p>
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
  );
};

export default NoteList;
