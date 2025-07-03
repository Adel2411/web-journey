import React from 'react';
import Header from './components/layout/Header';
import NoteList from './components/notes/NoteList';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-4">
        <NoteList />
      </main>
    </div>
  );
}

export default App;
