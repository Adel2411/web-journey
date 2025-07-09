import React, { useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/notes?search=${encodeURIComponent(search)}`);
      const data = await res.json();
console.log(data); // Add this line
setNotes(data.data); 
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
    setLoading(false);
  };

  return (
    <div className='flex flex-col justify-center items-center p-10'>
      <h1>Note Search</h1>

      <input
        type="text"
        placeholder="Search by title or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      <ul>
        {notes.length > 0 ? (
          notes.map(note => (
            <li key={note.id} style={{ marginTop: '1rem' }}>
              <strong>{note.title}</strong>
              <p>{note.content}</p>
            </li>
          ))
        ) : (
          !loading && <p>No notes found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
