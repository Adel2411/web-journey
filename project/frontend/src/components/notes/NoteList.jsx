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
        <h1 className="NoteList-title">Notes ({filteredNotes.length})</h1>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active-button' : 'inactive-button'}>All Notes</button>
          <button onClick={() => setFilter('mine')} className={filter === 'mine' ? 'active-button' : 'inactive-button'}>My Notes</button>
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
