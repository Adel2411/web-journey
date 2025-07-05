import React, { useState } from "react";
import NoteItem from "./NoteItem";
import { sampleNotes } from "../../data/sampleNotes";

const NoteList = () => {
  const [showMyNotes, setShowMyNotes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); 
  const myName = "Kenza";

  const filteredNotes = sampleNotes
    .filter((note) =>
      showMyNotes ? note.authorName === myName : true
    )
    .filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.authorName.localeCompare(b.authorName);
      return new Date(b.createdAt) - new Date(a.createdAt); 
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMyNotes(false)}
            className={`px-4 py-2 rounded ${
              !showMyNotes
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 transition-shadow`}
          >
            All Notes
          </button>
          <button
            onClick={() => setShowMyNotes(true)}
            className={`px-4 py-2 rounded ${
              showMyNotes
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 transition-shadow`}
          >
            My Notes
          </button>

          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
      </div>

      <div className="mb-6 text-right">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-shadow">
          + Create Note
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No notes found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;


