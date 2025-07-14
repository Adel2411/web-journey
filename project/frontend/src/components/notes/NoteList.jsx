// import { sampleNotes } from "../../data/sampleNotes";
import { useState, useEffect } from "react";
import NoteItem from "./NoteItem";

const NotesList = ({ search }) => {

  const [viewNotes, setViewNotes] = useState("all");
  const currentUser = "John Doe";

  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])

  useEffect(()=>{
    setLoading(true);
    fetch("http://localhost:5000/api/notes")
    .then(res => res.json())
    .then((note) =>{
        console.log("Fetched notes:", note);
        setNotes(note.data);
        setLoading(false)
   })
   .catch(() => setLoading(false));
  }, [])

  const filteredNotes = notes
    .filter((note) => viewNotes === "all" || note.authorName === currentUser)
    .filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );



 return (

  <div className="max-w-6xl mx-auto px-6 py-10">
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-gray-100 animate-pulse h-48 space-y-4"
          >
            <div className="bg-gray-300 h-6 w-2/3 rounded" />
            <div className="bg-gray-300 h-4 w-full rounded" />
            <div className="bg-gray-300 h-4 w-5/6 rounded" />
            <div className="bg-gray-300 h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    ) : (
      <>
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
      </>
    )}
  </div>
);}


export default NotesList;
