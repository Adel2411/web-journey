import React, { useState } from 'react';
import { sampleNotes } from '../../data/sampleNotes';
import NoteItem from './NoteItem';
import './NoteList.css';

export default function NoteList() {
  const [notes] = useState(sampleNotes);
  const [filter, setFilter] = useState('all');

  const filteredNotes = filter === 'all' ? notes : notes.filter(n => n.authorName === "John Doe");

  return (
    <div className="NoteList-container">
      <div className="NoteList-header">
        <h1 className="NoteList-Title">Notes ({filteredNotes.length})</h1>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            All Notes
          </button>
          <button onClick={() => setFilter('mine')} className={`px-4 py-2 rounded ${filter === 'mine' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            My Notes
          </button>
        </div>
      </div>
      {filteredNotes.length === 0 ? (
        <p className="text-no-note">No notes to display.</p>
      ) : (
        <div className="note-grid">
          {filteredNotes.map(note => <NoteItem key={note.id} note={note} />)}
        </div>
      )}
    </div>
  );
}
