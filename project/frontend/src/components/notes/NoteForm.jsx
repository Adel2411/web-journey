// Note Form Component - DUPLICATE PREVENTION FIX
import React, { useState, useEffect } from 'react';
import { notesAPI } from '../../services/api';

const NoteForm = ({ 
  note = null, 
  isEditing = false, 
  onSave, 
  onCancel, 
  isVisible = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    isPublic: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Prevent double submission

  // Character limits
  const MAX_TITLE_LENGTH = 100;
  const MIN_TITLE_LENGTH = 3;
  const MAX_CONTENT_LENGTH = 1000;
  const MIN_CONTENT_LENGTH = 10;
  const MAX_AUTHOR_LENGTH = 100;

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        author: note.author || '',
        isPublic: note.isPublic || false,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        author: '',
        isPublic: false,
      });
    }
    setError('');
    setIsSubmitting(false); // Reset submission state
  }, [isEditing, note, isVisible]);

  // Update word and character count
  useEffect(() => {
    const words = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
    const chars = formData.content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [formData.content]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) {
      setError('');
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (formData.title.trim().length < MIN_TITLE_LENGTH) {
      setError(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      return false;
    }
    
    if (formData.title.length > MAX_TITLE_LENGTH) {
      setError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    
    if (formData.content.trim().length < MIN_CONTENT_LENGTH) {
      setError(`Content must be at least ${MIN_CONTENT_LENGTH} characters`);
      return false;
    }
    
    if (formData.content.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be less than ${MAX_CONTENT_LENGTH} characters`);
      return false;
    }

    if (formData.author.length > MAX_AUTHOR_LENGTH) {
      setError(`Author must be less than ${MAX_AUTHOR_LENGTH} characters`);
      return false;
    }
    
    return true;
  };

  // Handle form submission - FIXED FOR DUPLICATE PREVENTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CRITICAL: Prevent double submission
    if (isSubmitting || loading) {
      console.log('🛑 Already submitting, ignoring duplicate submission');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setIsSubmitting(true); // Mark as submitting
    setError('');
    
    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublic: formData.isPublic,
      };

      // Only include author if it's not empty
      if (formData.author.trim()) {
        noteData.author = formData.author.trim();
      }
      
      console.log('🔄 Submitting form data:', noteData);
      
      let result;
      if (isEditing && note) {
        noteData._id = note._id || note.id;   
        result = await notesAPI.updateNote(note._id || note.id, noteData);
        console.log('✅ Update result:', result);
      } else {
        result = await notesAPI.createNote(noteData);
        console.log('✅ Create result:', result);
      }
      
      // Check for the correct response format
      if (result && (result._id || result.id)) {
        // IMPORTANT: Only call onSave once and wait for it to complete
        try {
          await onSave(result);
          console.log('✅ onSave completed successfully');
          
          // Reset form ONLY if creating new note AND onSave succeeded
          if (!isEditing) {
            setFormData({
              title: '',
              content: '',
              author: '',
              isPublic: false,
            });
          }
        } catch (onSaveError) {
          console.error('❌ onSave failed:', onSaveError);
          setError('Failed to update the note list');
        }
      } else {
        console.error('❌ Unexpected API response format:', result);
        setError('Failed to save note - unexpected response format');
      }
    } catch (err) {
      console.error('❌ Form submission error:', err);
      
      // Better error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred while saving the note');
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Reset submission state
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (!isEditing) {
      setFormData({
        title: '',
        content: '',
        author: '',
        isPublic: false,
      });
    }
    setError('');
    setIsSubmitting(false); // Reset submission state
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                {isEditing ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Note' : 'Create New Note'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditing ? 'Update your note' : 'Capture your thoughts'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors"
              disabled={loading || isSubmitting}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter note title (min 3 characters)..."
                maxLength={MAX_TITLE_LENGTH}
                disabled={loading || isSubmitting}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={`${formData.title.length < MIN_TITLE_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                  Min: {MIN_TITLE_LENGTH} characters
                </span>
                <span className={`${formData.title.length > MAX_TITLE_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter author name..."
                maxLength={MAX_AUTHOR_LENGTH}
                disabled={loading || isSubmitting}
              />
              <div className="mt-1 text-right">
                <span className={`text-xs ${formData.author.length > MAX_AUTHOR_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.author.length}/{MAX_AUTHOR_LENGTH}
                </span>
              </div>
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder={`Start writing your note (min ${MIN_CONTENT_LENGTH} characters)...`}
                maxLength={MAX_CONTENT_LENGTH}
                disabled={loading || isSubmitting}
              />
              <div className="mt-1 flex justify-between text-xs">
                <div className="space-x-4">
                  <span className={`${formData.content.length < MIN_CONTENT_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                    Min: {MIN_CONTENT_LENGTH} chars
                  </span>
                  <span className="text-gray-500">Words: {wordCount}</span>
                </div>
                <span className={charCount > MAX_CONTENT_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-500'}>
                  {charCount}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make this note public
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Public notes can be viewed by other users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="sr-only peer"
                  disabled={loading || isSubmitting}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isSubmitting ? 'Saving...' : (isEditing ? 'Last updated: ' + (note?.updatedAt ? new Date(note.updatedAt).toLocaleString() : 'Unknown') : 'Ready to save')}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading || isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || isSubmitting ||
                !formData.title.trim() || 
                formData.title.trim().length < MIN_TITLE_LENGTH ||
                !formData.content.trim() || 
                formData.content.trim().length < MIN_CONTENT_LENGTH}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                loading || isSubmitting ||
                !formData.title.trim() || 
                formData.title.trim().length < MIN_TITLE_LENGTH ||
                !formData.content.trim() || 
                formData.content.trim().length < MIN_CONTENT_LENGTH
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading || isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Note' : 'Create Note'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;