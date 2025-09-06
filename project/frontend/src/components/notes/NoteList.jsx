import React, { useState, useEffect, useRef } from 'react';
import { notesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';

const NoteList = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Use ref to track component mounting state
  const isMountedRef = useRef(true);

  useEffect(() => {
    loadNotes();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load notes with better error handling
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Starting loadNotes...');
      const response = await notesAPI.getAllNotes();
      console.log('🔍 LoadNotes response:', response);
      
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;
      
      if (response.success && Array.isArray(response.data)) {
        console.log(`✅ Loaded ${response.data.length} notes from API`);
        setNotes(response.data);
      } else if (Array.isArray(response)) {
        console.log(`✅ Loaded ${response.length} notes (direct array)`);
        setNotes(response);
      } else {
        console.log('❌ Unexpected response format:', response);
        setError('Unexpected response format from server');
      }
    } catch (err) {
      console.log('❌ LoadNotes error:', err);
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      // Handle authentication errors specifically
      if (err.message.includes('Authentication') || err.message.includes('log in again')) {
        setError('Your session has expired. Please log in again.');
        logout();
      } else {
        setError(err.message || 'An error occurred while loading notes');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // ✅ FIXED: This is called by NoteForm after API call is made
  // It should ONLY update local state, NOT make API calls
  const handleSaveNote = async (savedNote) => {
    try {
      console.log('📝 Handling saved note (no API call):', savedNote);
      
      if (!isMountedRef.current) return;
      
      if (editingNote) {
        // Update existing note in local state
        setNotes(prevNotes => 
          prevNotes.map(note => 
            (note.id === savedNote.id || note._id === savedNote._id) 
              ? savedNote 
              : note
          )
        );
        console.log('✅ Updated existing note in state');
      } else {
        // Add new note to local state (prevent duplicates)
        setNotes(prevNotes => {
          // Check if note already exists to prevent duplicates
          const noteExists = prevNotes.some(note => 
            note.id === savedNote.id || 
            note._id === savedNote._id
          );
          
          if (noteExists) {
            console.log('🛑 Note already exists, not adding duplicate');
            return prevNotes;
          }
          
          console.log('✅ Adding new note to state');
          return [savedNote, ...prevNotes];
        });
      }
      
      // Close form and reset editing state
      setShowForm(false);
      setEditingNote(null);
      
    } catch (error) {
      console.error('❌ Error handling saved note:', error);
      if (!isMountedRef.current) return;
      setError('Failed to update note list');
    }
  };

  // ✅ SEPARATE: Direct API operations (for when NOT using the form)
  // const handleCreateNote = async (noteData) => {
  //   try {
  //     console.log('🔄 Creating note directly via API:', noteData);
  //     const newNote = await notesAPI.createNote(noteData);
  //     console.log('✅ Note created via API:', newNote);
      
  //     if (!isMountedRef.current) return;
      
  //     // Add to local state
  //     setNotes(prevNotes => {
  //       const noteExists = prevNotes.some(note => 
  //         note.id === newNote.id || note._id === newNote._id
  //       );
        
  //       if (noteExists) {
  //         console.log('🛑 Direct API note already exists');
  //         return prevNotes;
  //       }
        
  //       return [newNote, ...prevNotes];
  //     });
      
  //     return newNote;
  //   } catch (err) {
  //     console.error('❌ Failed to create note via API:', err);
      
  //     if (!isMountedRef.current) return;
      
  //     if (err.message.includes('Authentication') || err.message.includes('log in again')) {
  //       setError('Your session has expired. Please log in again.');
  //       logout();
  //     } else {
  //       setError(err.message || 'Failed to create note');
  //     }
  //     throw err;
  //   }
  // };

  const handleEditNote = (note) => {
    console.log('📝 Opening edit form for note:', note.id || note._id);
    setEditingNote(note);
    setShowForm(true);
  };

  // ✅ SEPARATE: Direct API update (for when NOT using the form)
  // const handleUpdateNote = async (noteId, noteData) => {
  //   try {
  //     console.log('🔄 Updating note directly via API:', noteId, noteData);
  //     const updatedNote = await notesAPI.updateNote(noteId, noteData);
  //     console.log('✅ Note updated via API:', updatedNote);
      
  //     if (!isMountedRef.current) return;
      
  //     // Update in local state
  //     setNotes(prevNotes => 
  //       prevNotes.map(note => 
  //         (note.id === noteId || note._id === noteId) 
  //           ? updatedNote 
  //           : note
  //       )
  //     );
      
  //     return updatedNote;
  //   } catch (err) {
  //     console.error('❌ Failed to update note via API:', err);
      
  //     if (!isMountedRef.current) return;
      
  //     if (err.message.includes('Authentication') || err.message.includes('log in again')) {
  //       setError('Your session has expired. Please log in again.');
  //       logout();
  //     } else {
  //       setError(err.message || 'Failed to update note');
  //     }
  //     throw err;
  //   }
  // };

  // Handle deleting a note with better error handling
  const handleDeleteNote = async (noteId) => {
    try {
      console.log('🗑️ Deleting note:', noteId);
      const response = await notesAPI.deleteNote(noteId);
      
      if (!isMountedRef.current) return;
      
      if (response.success) {
        setNotes(prev => prev.filter(note => note._id !== noteId && note.id !== noteId));
        setDeleteConfirm(null);
        console.log('✅ Note deleted successfully');
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (err) {
      console.error('❌ Failed to delete note:', err);
      
      if (!isMountedRef.current) return;
      
      if (err.message.includes('Authentication') || err.message.includes('log in again')) {
        setError('Your session has expired. Please log in again.');
        logout();
      } else {
        setError(err.message || 'Failed to delete note');
      }
    }
  };

  const confirmDelete = (note) => {
    setDeleteConfirm(note);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getFilteredAndSortedNotes = () => {
    let filteredNotes = notes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    filteredNotes.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredNotes;
  };

  const handleFormClose = () => {
    console.log('📝 Closing form');
    setShowForm(false);
    setEditingNote(null);
  };

  const filteredNotes = getFilteredAndSortedNotes();

  // Debug logging (remove this in production)
  console.log('🔍 RENDER DEBUG:');
  console.log('  - Notes in state:', notes.length);
  console.log('  - Filtered notes:', filteredNotes.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              You have {notes.length} note{notes.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          
          <button
            onClick={() => {
              console.log('📝 Opening create form');
              setEditingNote(null);
              setShowForm(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Note
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title or content"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="updatedAt-asc">Oldest Updated</option>
              <option value="createdAt-desc">Recently Created</option>
              <option value="createdAt-asc">Oldest Created</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 text-sm">{error}</span>
            <button 
              onClick={loadNotes}
              className="ml-4 text-red-600 hover:text-red-800 underline text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Start capturing your thoughts and ideas by creating your first note.'
            }
          </p>
          <button
            onClick={() => {
              setEditingNote(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Note
          </button>
        </div>
      ) : (
        /* Notes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteItem
              key={note._id || note.id}
              note={note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => confirmDelete(note)}
              currentUser={user}
            />
          ))}
        </div>
      )}

      {/* Note Form Modal */}
      <NoteForm
        note={editingNote}
        isEditing={!!editingNote}
        isVisible={showForm}
        onSave={handleSaveNote}   
        onCancel={handleFormClose}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Note</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete "<span className="font-semibold">{deleteConfirm.title}</span>"?
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNote(deleteConfirm._id || deleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;