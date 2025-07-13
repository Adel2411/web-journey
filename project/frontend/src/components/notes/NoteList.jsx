import { sampleNotes } from "../../data/sampleNotes";
import { useState } from "react";
import NoteItem from "./NoteItem";

const NotesList = ({ search }) => {
  const [viewNotes, setViewNotes] = useState("all");
  const currentUser = "John Doe";

  const filteredNotes = sampleNotes
    .filter((note) => viewNotes === "all" || note.authorName === currentUser)
    .filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        
        
        <div className="flex gap-4">
          <button
            onClick={() => setViewNotes("mine")}
            className={`px-5 py-2.5 rounded-xl text-base font-medium border transition-all duration-300 ${
              viewNotes === "mine"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            My Notes
          </button>
          <button
            onClick={() => setViewNotes("all")}
            className={`px-5 py-2.5 rounded-xl text-base font-medium border transition-all duration-300 ${
              viewNotes === "all"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            All Notes
          </button>
        </div>

       
        <div className="text-base text-gray-700 font-semibold">
          Total Notes: {filteredNotes.length}
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No notes to display.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
