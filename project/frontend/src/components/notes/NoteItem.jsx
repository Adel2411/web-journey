// src/components/notes/NoteItem.jsx
import React from 'react';

const NoteItem = ({ note }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 h-full flex flex-col">
      {/* Header with title and privacy indicator */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {note.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          note.isPublic 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {note.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Content preview - grows to fill available space */}
      <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
        {truncateContent(note.content)}
      </p>

      {/* Footer with author and date - always at bottom */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-auto">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
            {note.authorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{note.authorName}</span>
        </div>
        <time className="text-gray-400">
          {formatDate(note.createdAt)}
        </time>
      </div>
    </div>
  );
};

export default NoteItem;