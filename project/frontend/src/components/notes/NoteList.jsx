import React, { useState, useEffect } from 'react';

// Enhanced NoteItem component with all features
const NoteItem = ({ note, onFavoriteToggle, isFavorite }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate content if too long
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking heart
    onFavoriteToggle?.(note.id, !isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 flex flex-col min-h-[280px] w-full">
      {/* Header with title, favorite icon, and privacy indicator */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 leading-tight flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex items-center space-x-2">
          {/* Favorite Heart Icon */}
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded-full transition-colors ${
              isFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {/* Privacy Badge */}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            note.isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {note.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Content preview - grows to fill available space */}
      <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
        {truncateContent(note.content)}
      </p>

      {/* Footer with author and date - always at bottom */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-auto">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
            {note.authorName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="font-medium">{note.authorName || 'Anonymous'}</span>
        </div>
        <time className="text-gray-400">
          {formatDate(note.createdAt || Date.now())}
        </time>
      </div>
    </div>
  );
};

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [favorites, setFavorites] = useState(new Set()); 
  const [currentUser] = useState('John Doe'); 

  // Fetch notes from API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await fetch('http://localhost:5000/api/notes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching notes:', err);
        
        // If API fails, use empty array 
        const mockNotes = [];
        
        setNotes(mockNotes);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesView = viewMode === 'all' || note.authorName === currentUser;
      const matchesSearch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesView && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return (a.authorName || '').localeCompare(b.authorName || '');
        case 'date':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const handleFavoriteToggle = (noteId, isFavorite) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(noteId);
      } else {
        newFavorites.delete(noteId);
      }
      return newFavorites;
    });
    console.log(`Note ${noteId} ${isFavorite ? 'favorited' : 'unfavorited'}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Clean Header Section */}
      <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Notes ({notes.length})
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'my'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Notes ({notes.filter(note => note.authorName === currentUser).length})
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
              </select>
            </div>
            
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Grid - Takes remaining space */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="h-full flex flex-col">
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredNotes.map(note => (
                <NoteItem 
                  key={note.id} 
                  note={note} 
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={favorites.has(note.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No notes found' : (viewMode === 'my' ? 'No personal notes yet' : 'No notes yet')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : (viewMode === 'my' ? 'Create your first personal note' : 'Create your first note to get started')
                  }
                </p>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 mx-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteList;